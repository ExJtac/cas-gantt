#!/usr/bin/env node
import {randomBytes} from 'node:crypto';import {existsSync,writeFileSync} from 'node:fs';
const [major,minor]=process.versions.node.split('.').map(Number);if(major<22||(major===22&&minor<12))throw new Error('Install Node.js 22.12 or newer before setup.');
if(existsSync('.env')){console.log('Existing .env preserved. Review README before changing its origin, ports or storage.');process.exit(0);}
const value=`# Generated locally. Do not commit or share this file.\nCAS_DB_PASSWORD=${randomBytes(32).toString('hex')}\nGANTT_ENCRYPTION_KEY=${randomBytes(32).toString('hex')}\nGANTT_PUBLIC_ORIGIN=http://localhost:8080\nGANTT_REGISTRATION=enabled\nGANTT_MOCK_BILLING=enabled\nNODE_ENV=development\nCAS_BIND_ADDRESS=127.0.0.1\nCAS_HTTP_PORT=8080\n`;
writeFileSync('.env',value,{flag:'wx',mode:0o600});console.log('Created private .env with unique local database and encryption keys. Next: docker compose up -d --build. Open http://localhost:8080/Ghannt/app/.');
