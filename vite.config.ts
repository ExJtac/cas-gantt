import { defineConfig } from 'vite';
export default defineConfig({base:'./',server:{proxy:{'/Ghannt/api':{target:'http://127.0.0.1:4318',rewrite:path=>path.replace(/^\/Ghannt/,'')}}}});
