import {parentPort,workerData} from 'node:worker_threads';
import {tsImport} from 'tsx/esm/api';
try {const {calculate,materialize}=await tsImport('./index.ts',import.meta.url);const result=calculate(workerData);parentPort.postMessage({ok:true,result,materialized:materialize(workerData)});}catch(error){parentPort.postMessage({ok:false,error:error.message});}
