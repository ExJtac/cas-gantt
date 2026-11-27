import type {Project} from './domain';
export type Role='owner'|'scheduler'|'editor'|'viewer'|'procurement';
export type Organization={id:string;name:string;role:Role};
export type Session={csrf:string;user:{id:string;username:string;displayName:string};organizations:Organization[]};
export class ApiError extends Error{constructor(message:string,public status:number,public code:string){super(message);}}
let session:Session|null=null;
let organization:string|null=null;
export function useSession(value:Session|null,org?:string){session=value;organization=org||value?.organizations[0]?.id||null;}
export async function api<T=any>(path:string,options:{method?:string;body?:unknown;version?:number;key?:string;responseType?:'blob'}={}):Promise<T>{
 const headers:Record<string,string>=options.body===undefined?{}:{'Content-Type':'application/json'};
 if(session)headers['X-CSRF-Token']=session.csrf;if(organization)headers['X-Organization-Id']=organization;
 if(options.version!==undefined)headers['If-Match']=String(options.version);if(options.key)headers['Idempotency-Key']=options.key;
 let response:Response;try{response=await fetch('/Ghannt/api/v1'+path,{method:options.method||'GET',signal:AbortSignal.timeout(15000),headers,credentials:'same-origin',body:options.body===undefined?undefined:JSON.stringify(options.body)});}catch{throw new ApiError('Could not confirm a server response. Keep this draft and retry when your connection is available.',0,'network_error');}
 if(options.responseType==='blob'&&response.ok)return await response.blob() as T;
 if(!response.headers.get('content-type')?.includes('application/json'))throw new ApiError('Server workspaces are not available on this preview. Use the CAS-TX hosted app or run the API locally.',503,'server_unavailable');
 const data=await response.json();if(!response.ok)throw new ApiError(data.error||'Request failed.',response.status,data.code||'request_error');return data;
}
export type CloudWorkspace={organization:Organization;session:Session;projects:Project[]};
export const writeKey=()=>crypto.randomUUID();
