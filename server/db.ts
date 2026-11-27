import pg, {type PoolClient} from 'pg';
import {readFile} from 'node:fs/promises';
export type Database = pg.Pool;
export function database(url:string){return new pg.Pool({connectionString:url,max:10,connectionTimeoutMillis:5000,statement_timeout:15000});}
export async function transaction<T>(pool:Database,fn:(client:PoolClient)=>Promise<T>):Promise<T>{const c=await pool.connect();try{await c.query('BEGIN');const result=await fn(c);await c.query('COMMIT');return result;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
export async function migrate(pool:Database){await transaction(pool,async c=>{await c.query("SELECT pg_advisory_xact_lock(728301)");await c.query(await readFile(new URL('./migrations/001_workspace.sql',import.meta.url),'utf8'));});}
