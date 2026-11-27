/** Pure calendar-date scheduling. No UI, storage, host timezone or network dependency. */
export type Relation = 'FS' | 'SS' | 'FF' | 'SF';
export type Calendar = { workdays: number[]; holidays: string[] };
export type Dependency = { taskId: string; relation: Relation; lag: number };
export const statuses = ['Not Started','In Progress','Completed','On Hold','Awaiting Approval','Behind Schedule','On Schedule','Ahead of Schedule'] as const;
export type Status = typeof statuses[number];
export type Task = { id: string; title: string; section: string; owner: string; start: string | null; duration: number; progress: number; status: Status; dependencies: Dependency[]; hold: string; notes: string; hours: number; milestone: boolean };
export type Section = { id: string; name: string; released: boolean };
export type Schedule = { tasks: Task[]; sections: Section[]; calendar: Calendar };
export type ScheduledTask = Task & { finish: string | null; blocked: string | null };
const DAY = 86400000;
export function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || s < '1900-01-01' || s > '2199-12-31') return false;
  const d = new Date(s + 'T00:00:00Z');
  return Number.isFinite(d.valueOf()) && d.toISOString().slice(0,10) === s;
}
export function addDays(s: string, n: number): string {
  return new Date(new Date(s + 'T00:00:00Z').valueOf() + n * DAY).toISOString().slice(0,10);
}
export function diffDays(a: string, b: string): number { return Math.round((Date.parse(a+'T00:00:00Z')-Date.parse(b+'T00:00:00Z'))/DAY); }
export function isWorking(s: string, c: Calendar): boolean { return c.workdays.includes(new Date(s+'T00:00:00Z').getUTCDay()) && !c.holidays.includes(s); }
export function workday(s: string, c: Calendar, direction = 1): string {
  for (let i=0;i<3700;i++,s=addDays(s,direction)) if (isWorking(s,c)) return s;
  throw new Error('Calendar has no available working day.');
}
export function shiftWork(s: string, n: number, c: Calendar): string {
  if(!Number.isInteger(n)||Math.abs(n)>10000)throw new Error("Workday offsets must be whole days within supported bounds.");
  let result=workday(s,c,n<0?-1:1);
  for(let i=0;i<Math.abs(n);i++) result=workday(addDays(result,n<0?-1:1),c,n<0?-1:1);
  return result;
}
export function finishOf(t: Pick<Task,'start'|'duration'|'milestone'>, c: Calendar): string|null { if(!Number.isInteger(t.duration)||t.duration<0||t.duration>3650)return null; return t.start ? shiftWork(t.start,t.milestone?0:Math.max(0,t.duration-1),c):null; }
export function orderTasks(tasks: Task[]): Task[] {
  const byId = new Map(tasks.map(t=>[t.id,t]));
  if(byId.size !== tasks.length) throw new Error('Task IDs must be unique.');
  const indegree=new Map(tasks.map(t=>[t.id,t.dependencies.length]));
  const children=new Map<string,string[]>();
  for(const t of tasks) for(const d of t.dependencies) {
    if(!byId.has(d.taskId)) throw new Error(`Missing predecessor for ${t.title}.`);
    if(d.taskId===t.id) throw new Error(`${t.title} cannot depend on itself.`);
    children.set(d.taskId,[...(children.get(d.taskId)||[]),t.id]);
  }
  const queue=tasks.filter(t=>!indegree.get(t.id)); const ordered:Task[]=[];
  for(let i=0;i<queue.length;i++) { const t=queue[i];ordered.push(t);for(const id of children.get(t.id)||[]) {indegree.set(id,indegree.get(id)!-1);if(!indegree.get(id))queue.push(byId.get(id)!);} }
  if(ordered.length!==tasks.length)throw new Error('Dependency cycle detected. Remove a link between: '+tasks.filter(t=>indegree.get(t.id)!>0).map(t=>t.title).join(', '));
  return ordered;
}
export function calculate(s: Schedule): { tasks: ScheduledTask[]; warnings: string[] } {
  if(!s.calendar.workdays.length)throw new Error('Select at least one working day.');
  const result = new Map<string,ScheduledTask>(); const warnings:string[]=[];
  for(const t of orderTasks(s.tasks)) {
    if(t.start && !validDate(t.start))throw new Error(`Invalid start date for ${t.title}.`);
    if(!Number.isInteger(t.duration)||t.duration<0||t.duration>3650||(!t.milestone && t.duration<1))throw new Error('Task duration must be 1–3650 workdays (0 for milestones).');
    const section = s.sections.find(x=>x.id===t.section);
    if(!section)throw new Error(`Unknown section for ${t.title}.`);
    let blocked = !section.released ? 'Section awaiting release' : t.hold || null;
    let start = t.start ? workday(t.start,s.calendar):null;
    if(start!==t.start)warnings.push(`${t.title}: moved to the next working day.`);
    for(const dep of t.dependencies) {
      if(!['FS','SS','FF','SF'].includes(dep.relation)||!Number.isInteger(dep.lag)||Math.abs(dep.lag)>3650)throw new Error('Invalid dependency relation or lag.');
      const p=result.get(dep.taskId)!;
      if(!p.start||!p.finish) {blocked=blocked||`Waiting for ${p.title}`;continue;}
      let lower:string;
      if(dep.relation==='FS')lower=shiftWork(p.finish,dep.lag+(p.milestone?0:1),s.calendar);
      else if(dep.relation==='SS')lower=shiftWork(p.start,dep.lag,s.calendar);
      else lower=shiftWork(dep.relation==='FF'?p.finish:p.start,dep.lag-(t.milestone?0:t.duration-1),s.calendar);
      if(!start||lower>start) start=lower;
    }
    if(blocked)start=null;
    if(start && !validDate(start))throw new Error('Calculated dates must be within 1900–2199.');
    const scheduled={...t,start,finish:finishOf({...t,start},s.calendar),blocked};
    if(scheduled.finish&&!validDate(scheduled.finish))throw new Error('Calculated finish is outside supported years.');
    result.set(t.id,scheduled);
  }
  return {tasks:s.tasks.map(t=>result.get(t.id)!),warnings};
}
export function materialize(s:Schedule):Task[] {return calculate(s).tasks.map(({finish: _f,blocked:_b,...t})=>t);}

export function resizedDuration(start:string,finish:string,calendar:Calendar):number {
  if(finish<start)return 1;let count=0;
  for(let d=start;d<=finish;d=addDays(d,1)){if(isWorking(d,calendar))count++;if(count>3650)throw new Error('Duration exceeds 3650 workdays.');}
  return Math.max(1,count);
}
