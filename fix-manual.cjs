const fs = require('fs');

function fixCopiloto() {
  let file = 'src/components/principal/CopilotoView.tsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\]; \/\/ Auto scroll useEffect/g, '];\n// Auto scroll\nuseEffect');
  code = code.replace(/\}; \/\/ Basic formatter to render bold, bullet points, headers elegantly in HTML const /g, '};\n// Basic formatter\nconst ');
  code = code.replace(/\} \/\/ Headers if/g, '}\n// Headers\nif');
  code = code.replace(/\} \/\/ Bullet points if/g, '}\n// Bullet points\nif');
  code = code.replace(/\} \/\/ Number list if/g, '}\n// Number list\nif');
  code = code.replace(/\} \/\/ Empty line if/g, '}\n// Empty line\nif');
  code = code.replace(/\}; \/\/ Inline bold parser const /g, '};\n// Inline bold parser\nconst ');
  fs.writeFileSync(file, code, 'utf8');
}

function fixDashboard() {
  let file = 'src/components/dashboard/DashboardView.tsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\/\/ Let's assume if lastMovem(.*?)\n/g, ''); // just remove it or fix it manually
  code = code.replace(/; \} \); \/\/ Areas calculation for chart const/g, ';\n});\n// Areas calculation for chart\nconst');
  code = code.replace(/; \/\/ Simulated agent thoughts const/g, ';\n// Simulated agent thoughts\nconst');
  code = code.replace(/; \/\/ Run custom sequential log animations const/g, ';\n// Run custom sequential log animations\nconst');
  fs.writeFileSync(file, code, 'utf8');
}

function fixContratos() {
  let file = 'src/components/documentos/ContratosView.tsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/setTimeout\(\(\) => \{ \/\/ Create and save signed document const docTitle/g, 'setTimeout(() => {\n// Create and save signed document\nconst docTitle');
  if(!code.endsWith('};')) {
     code += '};';
  }
  fs.writeFileSync(file, code, 'utf8');
}

function fixProcesso() {
  let file = 'src/components/operacao/ProcessoDetalheView.tsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\}\); \/\/ Trigger DataJud Import const/g, '});\n// Trigger DataJud Import\nconst');
  code = code.replace(/data\.json\(\); \/\/ Add movements that don't already exist if /g, 'data.json();\n// Add movements that don\'t already exist\nif ');
  code = code.replace(/\(m: any, idx: number\) => \{ \/\/ Convert date formatting if needed, but keeping standard const /g, '(m: any, idx: number) => {\n// Convert date formatting\nconst ');
  code = code.replace(/\); \/\/ DD\/MM\/YYYY to YYYY-MM-DD addMovement/g, ');\n// DD/MM/YYYY to YYYY-MM-DD\naddMovement');
  code = code.replace(/\}\); \} \/\/ Record Sync Audit Log addSyncLog/g, '});\n}\n// Record Sync Audit Log\naddSyncLog');
  code = code.replace(/\}\); \/\/ Update last sync date updateProcess/g, '});\n// Update last sync date\nupdateProcess');
  code = code.replace(/\}; \/\/ AI Summary generation const handle/g, '};\n// AI Summary generation\nconst handle');
  fs.writeFileSync(file, code, 'utf8');
}

function fixConflito() {
  let file = 'src/components/gestao/ConflitoInteresseView.tsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\]; \/\/ Check if searched name is an existing client in our CRM! const clientMatch/g, '];\n// Check if searched name is an existing client in our CRM!\nconst clientMatch');
  code = code.replace(/\)\); \/\/ Check if searched name matches a client or adverse party in any active process! const procMatches/g, '));\n// Check if searched name matches a client or adverse party in any active process!\nconst procMatches');
  code = code.replace(/\); if \(clientMatch \|\| procMatches.length > 0\) \{ \/\/ Conflict! const reasons: string\[\] = \[\];/g, ');\nif (clientMatch || procMatches.length > 0) {\n// Conflict!\nconst reasons: string[] = [];');
  code = code.replace(/\] \}\); \} else \{ \/\/ Clean path! setResults/g, ']\n});\n} else {\n// Clean path!\nsetResults');
  fs.writeFileSync(file, code, 'utf8');
}

fixCopiloto();
fixDashboard();
fixContratos();
fixProcesso();
fixConflito();

