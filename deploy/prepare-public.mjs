import {readFileSync,writeFileSync,mkdirSync,cpSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const release=process.argv[2];
if(!/^[a-z0-9-]+$/.test(release||''))throw new Error('Pass a unique release name.');
const base='artifacts';const root=`${base}/public-release`;
if(existsSync(root))throw new Error('Preserve the existing staged release; choose a fresh artifact directory before preparing again.');
mkdirSync(`${root}/Ghannt/app`,{recursive:true});
cpSync('dist',`${root}/Ghannt/app`,{recursive:true});
cpSync('public/Ghannt/index.html',`${root}/Ghannt/index.html`);
const caddy=readFileSync(`${base}/Caddyfile.before`,'utf8');
if(caddy.includes('cas-gantt.caddy'))throw new Error('Gantt is already registered; update the existing release handler instead.');
if(caddy.split('cas-tx.com {').length!==3) { // apex + www; exact line insertion below is the actual gate
 if(!caddy.includes('\ncas-tx.com {\n'))throw new Error('Expected CAS apex block missing.');
}
const next=caddy.replace('\ncas-tx.com {\n','\ncas-tx.com {\n\timport /etc/caddy/cas-gantt.caddy\n');
if(next===caddy)throw new Error('No Caddy edit made.');
writeFileSync(`${base}/Caddyfile.candidate`,next);
writeFileSync(`${base}/cas-gantt.caddy`,`# CAS Gantt standalone alpha; public local-storage app, no server project data.\n@cas_gantt path /Ghannt /Ghannt/*\nhandle @cas_gantt {\n  root * /var/www/cas-gantt/releases/${release}\n  header {\n    X-Content-Type-Options nosniff\n    X-Frame-Options SAMEORIGIN\n    Referrer-Policy strict-origin-when-cross-origin\n    Cache-Control "public, max-age=0, must-revalidate"\n    X-CAS-Gantt-Release ${release}\n  }\n  file_server\n}\n`);
const before=readFileSync(`${base}/open-source.before.html`,'utf8');
const card=`\n    <article class="catalog-card catalog-small"><div class="catalog-card-top"><span class="catalog-index">06 / CONSTRUCTION SCHEDULING</span><span class="catalog-badge">OPEN SOURCE · ALPHA</span></div><div class="catalog-glyph" aria-hidden="true">▥</div><div class="catalog-card-body"><h3>CAS Gantt</h3><p>Plan construction work with connected tasks, dependency previews, calendars and baseline snapshots. A free, browser-local scheduler under the MIT license.</p><a href="/Ghannt/">Explore CAS Gantt <span aria-hidden="true">↗</span></a></div></article>\n`;
if(!before.includes('<div class="catalog-grid">')||before.includes('CAS Gantt'))throw new Error('Catalog changed; reconcile before preparing.');
const after=before.replace('<div class="catalog-grid">','<div class="catalog-grid">'+card).replace('Explore five open-source projects','Explore six open-source projects').replace('FIVE PROJECTS / ONE PLACE TO START','SIX PROJECTS / ONE PLACE TO START');
writeFileSync(`${base}/open-source.candidate.html`,after);
const sitemap=readFileSync(`${base}/sitemap.before.xml`,'utf8');
if(!sitemap.includes('</urlset>'))throw new Error('Invalid sitemap');
writeFileSync(`${base}/sitemap.candidate.xml`,sitemap.replace('</urlset>','<url><loc>https://cas-tx.com/Ghannt/</loc></url></urlset>'));
const hash=s=>createHash('sha256').update(s).digest('hex');
writeFileSync(`${base}/preconditions.json`,JSON.stringify({release,caddy:hash(caddy),catalog:hash(before),sitemap:hash(sitemap)},null,2));
console.log(JSON.stringify({release,root,changes:['new /Ghannt promotion + /Ghannt/app editor','one CAS-only Caddy import','one open-source catalog card','one sitemap URL']},null,2));
