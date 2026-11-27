import {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';
import {mkdir,writeFile,readFile,unlink} from 'node:fs/promises';import {resolve,dirname} from 'node:path';
const root=resolve(process.env.GANTT_FILE_DIRECTORY||'.local/attachments');
const client=process.env.GANTT_S3_BUCKET?new S3Client({region:process.env.GANTT_S3_REGION||'us-east-1',endpoint:process.env.GANTT_S3_ENDPOINT,forcePathStyle:true}):null;
function path(key:string){const p=resolve(root,key);if(!p.startsWith(root+'/'))throw new Error('Invalid object key.');return p;}
export const storageKind=client?'s3':'local';
export async function putObject(key:string,body:Buffer,mime:string){if(client)await client.send(new PutObjectCommand({Bucket:process.env.GANTT_S3_BUCKET,Key:key,Body:body,ContentType:mime,ServerSideEncryption:process.env.GANTT_S3_ENCRYPTION==='AES256'?'AES256':undefined}));else{const p=path(key);await mkdir(dirname(p),{recursive:true,mode:0o700});await writeFile(p,body,{mode:0o600,flag:'wx'});}}
export async function getObject(key:string,kind:string){if(kind==='s3'){if(!client)throw new Error('S3 storage is not configured.');const r=await client.send(new GetObjectCommand({Bucket:process.env.GANTT_S3_BUCKET,Key:key}));return Buffer.from(await r.Body!.transformToByteArray());}return readFile(path(key));}
export async function removeObject(key:string,kind:string){if(kind==='s3'){if(!client)throw new Error('S3 storage is not configured.');await client.send(new DeleteObjectCommand({Bucket:process.env.GANTT_S3_BUCKET,Key:key}));}else await unlink(path(key));}
