import {Worker} from 'node:worker_threads';
import {randomUUID} from 'node:crypto';
import type {PoolClient} from 'pg';
import type {Database} from './db';
import {transaction} from './db';
import {HttpError} from './security';

// Bound pending work per tenant and expire result blobs; never discard project revisions.
export async function enqueueJob(c:PoolClient,org:string,project:string,actor:string,kind:'preview'|'export',payload:unknown){
 await c.query('SELECT id FROM gantt_organizations WHERE id=$1 FOR UPDATE',[org]);
 const pending=await c.query("SELECT count(*)::int AS n FROM gantt_jobs WHERE organization_id=$1 AND state IN('queued','running')",[org]);
 if(pending.rows[0].n>=10)throw new HttpError(429,'This workspace has ten jobs pending. Wait for them to finish before retrying.','queue_full');
 const id=randomUUID();await c.query('INSERT INTO gantt_jobs(id,organization_id,project_id,actor_id,kind,payload) VALUES($1,$2,$3,$4,$5,$6)',[id,org,project,actor,kind,JSON.stringify(payload)]);return id;
}
export function workerCalculation(schedule:unknown,kind='preview'){
 return new Promise<any>((resolve,reject)=>{
  const worker=new Worker(new URL(kind==='export'?'./export-worker.mjs':'../packages/scheduling-engine/worker.mjs',import.meta.url),{workerData:schedule});
  const timer=setTimeout(()=>{worker.terminate();reject(new Error('Calculation timeout.'));},30000);
  worker.once('message',data=>{clearTimeout(timer);worker.terminate();data.ok?resolve(data):reject(new Error(data.error));});
  worker.once('error',e=>{clearTimeout(timer);reject(e);});
  worker.once('exit',code=>{if(code!==0){clearTimeout(timer);reject(new Error('Calculation worker stopped.'));}});
 });
}
export function startQueue(pool:Database){
 let stopped=false,running=false,lastCleanup=0;
 async function tick(){
  if(stopped||running)return;running=true;
  try{
   if(Date.now()-lastCleanup>60_000){
    await pool.query("DELETE FROM gantt_jobs WHERE state IN('complete','failed') AND updated_at<now()-interval '24 hours'");
    await pool.query("UPDATE gantt_jobs SET state=CASE WHEN attempts<3 THEN 'queued' ELSE 'failed' END,error=CASE WHEN attempts>=3 THEN 'Worker retry limit reached' ELSE error END,updated_at=now() WHERE state='running' AND updated_at<now()-interval '2 minutes'");
    lastCleanup=Date.now();
   }
   const job=await transaction(pool,async c=>{
    const r=await c.query("SELECT * FROM gantt_jobs WHERE state='queued' AND attempts<3 ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED");
    if(!r.rowCount)return;
    await c.query("UPDATE gantt_jobs SET state='running',attempts=attempts+1,updated_at=now() WHERE id=$1",[r.rows[0].id]);return r.rows[0];
   });
   if(job){try{
    const result=await workerCalculation(job.kind==='export'?job.payload:job.payload.project,job.kind);
    await pool.query("UPDATE gantt_jobs SET state='complete',result=$2,updated_at=now() WHERE id=$1",[job.id,JSON.stringify(job.kind==='export'?result.result:{project:{...job.payload.project,tasks:result.materialized},warnings:result.result.warnings,expectedVersion:job.payload.project.version,metadata:result.result.metadata})]);
   }catch(e){await pool.query("UPDATE gantt_jobs SET state='failed',error=$2,updated_at=now() WHERE id=$1",[job.id,(e as Error).message]);}}
  }catch{ /* Database health endpoint exposes outages; next tick retries. */ }finally{running=false;}
 }
 const timer=setInterval(tick,200);timer.unref();return async()=>{stopped=true;clearInterval(timer);while(running)await new Promise(r=>setTimeout(r,20));};
}
