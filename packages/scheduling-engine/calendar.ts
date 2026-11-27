import type {Calendar} from './types';
const DAY=86400000;
export function validDate(s:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||s<'1900-01-01'||s>'2199-12-31')return false;const d=new Date(s+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;}
export function addDays(s:string,n:number){return new Date(Date.parse(s+'T00:00:00Z')+n*DAY).toISOString().slice(0,10);}
export function diffDays(a:string,b:string){return Math.round((Date.parse(a+'T00:00:00Z')-Date.parse(b+'T00:00:00Z'))/DAY);}
export const at=(date:string,minute=0)=>Date.parse(date+'T00:00:00Z')/60000+minute;
export const dateAt=(minute:number)=>new Date(Math.floor(minute/1440)*DAY).toISOString().slice(0,10);
export const minuteAt=(minute:number)=>((minute%1440)+1440)%1440;
export function intervals(date:string,c:Calendar){const exception=c.exceptions?.find(e=>e.date===date);if(exception)return exception.shifts;if(!c.workdays.includes(new Date(date+'T00:00:00Z').getUTCDay())||c.holidays.includes(date)||c.blackouts?.some(b=>date>=b.start&&date<=b.finish))return [];return c.shifts||[{start:480,end:960}];}
export const dayMinutes=(c:Calendar)=>(c.shifts||[{start:480,end:960}]).reduce((n,s)=>n+s.end-s.start,0);
export const isWorking=(d:string,c:Calendar)=>intervals(d,c).length>0;
export function workday(s:string,c:Calendar,direction=1){for(let i=0;i<3700;i++,s=addDays(s,direction))if(isWorking(s,c))return s;throw new Error('Calendar has no available working day.');}
export function shiftWork(s:string,n:number,c:Calendar){if(!Number.isInteger(n)||Math.abs(n)>10000)throw new Error('Workday offsets must be whole days within supported bounds.');let r=workday(s,c,n<0?-1:1);for(let i=0;i<Math.abs(n);i++)r=workday(addDays(r,n<0?-1:1),c,n<0?-1:1);return r;}
/** Civil minutes, independent of machine timezone. End boundaries are inclusive for finishes, exclusive for starts. */
export function snap(t:number,c:Calendar,direction=1):number{let d=dateAt(t);for(let guard=0;guard<110000;guard++){const base=at(d),spans=intervals(d,c);if(direction>0){for(const s of spans)if(t<base+s.end)return Math.max(t,base+s.start);d=addDays(d,1);t=at(d);}else{for(const s of [...spans].reverse())if(t>base+s.start)return Math.min(t,base+s.end);d=addDays(d,-1);t=at(d,1440);}}throw new Error('No working time within supported calendar range.');}
export function addMinutes(t:number,delta:number,c:Calendar):number{if(!Number.isInteger(delta)||Math.abs(delta)>6000000)throw new Error('Working duration exceeds supported bounds.');if(!delta)return t;const direction=delta>0?1:-1;let left=Math.abs(delta);for(let guard=0;guard<110000;guard++){t=snap(t,c,direction);const d=dateAt(t-(direction<0&&minuteAt(t)===0?1:0)),base=at(d),span=intervals(d,c).find(s=>direction>0?t>=base+s.start&&t<base+s.end:t>base+s.start&&t<=base+s.end)!;const available=direction>0?base+span.end-t:t-base-span.start;const used=Math.min(left,available);t+=used*direction;left-=used;if(!left)return t;}throw new Error('Calendar calculation exceeds supported range.');}
export function workBetween(a:number,b:number,c:Calendar):number{if(a===b)return 0;if(a>b)return -workBetween(b,a,c);let result=0;for(let d=dateAt(a);at(d)<b;d=addDays(d,1)){for(const s of intervals(d,c))result+=Math.max(0,Math.min(b,at(d,s.end))-Math.max(a,at(d,s.start)));}return result;}
export function resizedDuration(start:string,finish:string,c:Calendar){if(finish<start)return 1;let count=0;for(let d=start;d<=finish;d=addDays(d,1)){if(isWorking(d,c))count++;if(count>3650)throw new Error('Duration exceeds 3650 workdays.');}return Math.max(1,count);}
