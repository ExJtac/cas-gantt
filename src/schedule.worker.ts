import {calculate,materialize} from '../packages/scheduling-engine';
self.onmessage=({data})=>{try{self.postMessage({ok:true,result:calculate(data),tasks:materialize(data)});}catch(e){self.postMessage({ok:false,error:(e as Error).message});}};
