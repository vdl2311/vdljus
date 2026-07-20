const fs = require('fs');

let f = 'src/components/gestao/ConflitoInteresseView.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Check\nif searched/g, '// Check if searched');
c = c.replace(/\/\/ Check\nif searched name matches/g, '// Check if searched name matches');
// It might be on one line but with \n in the middle. Let's just fix the syntax error directly:
c = c.replace(/\/\/ Check\s+if searched name is an existing client in our CRM! const matchingClients =/g, '// Check if searched name is an existing client in our CRM!\nconst matchingClients =');
c = c.replace(/\/\/ Check\s+if searched name matches a client or adverse party in processes const matchingProcesses =/g, '// Check if searched name matches a client or adverse party in processes\nconst matchingProcesses =');
c = c.replace(/\/\/ Conflict!\s+const reasons: string\[\] =/g, '// Conflict!\nconst reasons: string[] =');
c = c.replace(/\/\/ Clean path!\s+setResults\(\{ conflict/g, '// Clean path!\nsetResults({ conflict');
fs.writeFileSync(f, c, 'utf8');

f = 'src/components/operacao/ProcessoDetalheView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Convert date formatting\s+if needed, but keeping standard\s+const formattedDate =/g, '// Convert date formatting if needed, but keeping standard\nconst formattedDate =');
c = c.replace(/\/\/ Add movements that don't already exist\s+if \(data\.movements/g, '// Add movements that don\'t already exist\nif (data.movements');
c = c.replace(/\/\/ DD\/MM\/YYYY to YYYY-MM-DD\s+addMovement\(/g, '// DD/MM/YYYY to YYYY-MM-DD\naddMovement(');
c = c.replace(/\/\/ Record Sync Audit Log\s+addSyncLog\(\{/g, '// Record Sync Audit Log\naddSyncLog({');
c = c.replace(/\/\/ Update last sync date\s+updateProcess\(/g, '// Update last sync date\nupdateProcess(');
c = c.replace(/\/\/ AI Summary generation\s+const handleRegenerateAISummary =/g, '// AI Summary generation\nconst handleRegenerateAISummary =');
c = c.replace(/\/\/ Trigger DataJud Import\s+const handleDataJudImport =/g, '// Trigger DataJud Import\nconst handleDataJudImport =');
fs.writeFileSync(f, c, 'utf8');

