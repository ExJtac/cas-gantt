const key='cas-gantt.display-timezone';
export function displayTimezone(){try{return localStorage.getItem(key)||Intl.DateTimeFormat().resolvedOptions().timeZone;}catch{return 'UTC';}}
export function setDisplayTimezone(zone:string){new Intl.DateTimeFormat('en',{timeZone:zone});localStorage.setItem(key,zone);}
export function eventTime(timestamp:string){return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short',timeZone:displayTimezone()}).format(new Date(timestamp));}
