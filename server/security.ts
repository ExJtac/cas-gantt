import {randomBytes,createHash,scrypt,timingSafeEqual} from 'node:crypto';
const derive=(password:string,salt:string)=>new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(e,key)=>e?reject(e):resolve(key)));
export const token=()=>randomBytes(32).toString('base64url');
export const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export async function passwordHash(password:string){const salt=randomBytes(16).toString('hex');return `scrypt:${salt}:${(await derive(password,salt)).toString('hex')}`;}
export async function verifyPassword(password:string,hash:string){const [algorithm,salt,key]=hash.split(':');if(algorithm!=='scrypt'||!salt||!key)return false;const actual=await derive(password,salt);const expected=Buffer.from(key,'hex');return expected.length===actual.length&&timingSafeEqual(actual,expected);}
export function sameSecret(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
export class HttpError extends Error{constructor(public statusCode:number,message:string,public code='request_error'){super(message);}}
