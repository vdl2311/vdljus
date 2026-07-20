const fs = require('fs');

let f = 'src/components/dashboard/DashboardView.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ On-the-fly dynamic Calculations const activeProcesses/g, '// On-the-fly dynamic Calculations\nconst activeProcesses');
c = c.replace(/\/\/ Finance metrics for current month const incomeLaunches/g, '// Finance metrics for current month\nconst incomeLaunches');
c = c.replace(/\/\/ Stagnant processes \(>90 days\) \/\/ Let's assume if lastMovementDate is empty, it's new/g, '// Stagnant processes (>90 days)\n// Let\'s assume if lastMovementDate is empty, it\'s new');
c = c.replace(/return days > 90; \}\); \/\/ Areas calculation for chart const areaCounts/g, 'return days > 90; });\n// Areas calculation for chart\nconst areaCounts');
c = c.replace(/\/\/ Simulated agent thoughts const thoughtLogs/g, '// Simulated agent thoughts\nconst thoughtLogs');
c = c.replace(/\/\/ Run custom sequential log animations const activeThoughts/g, '// Run custom sequential log animations\nconst activeThoughts');
fs.writeFileSync(f, c, 'utf8');

f = 'src/components/documentos/ContratosView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Create and save signed document const docTitle/g, '// Create and save signed document\nconst docTitle');
fs.writeFileSync(f, c, 'utf8');

f = 'src/components/operacao/ProcessoDetalheView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Trigger DataJud Import const handleDataJudImport/g, '// Trigger DataJud Import\nconst handleDataJudImport');
c = c.replace(/\/\/ Add movements that don't already exist if \(data/g, '// Add movements that don\'t already exist\nif (data');
c = c.replace(/\/\/ Convert date formatting if needed, but keeping standard const formattedDate/g, '// Convert date formatting if needed, but keeping standard\nconst formattedDate');
c = c.replace(/\/\/ DD\/MM\/YYYY to YYYY-MM-DD addMovement/g, '// DD/MM/YYYY to YYYY-MM-DD\naddMovement');
c = c.replace(/\/\/ Record Sync Audit Log addSyncLog/g, '// Record Sync Audit Log\naddSyncLog');
c = c.replace(/\/\/ Update last sync date updateProcess/g, '// Update last sync date\nupdateProcess');
c = c.replace(/\/\/ AI Summary generation const handleRegenerateAISummary/g, '// AI Summary generation\nconst handleRegenerateAISummary');
fs.writeFileSync(f, c, 'utf8');

f = 'src/components/gestao/ConflitoInteresseView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Check if searched name is an existing client in our CRM! const clientMatch/g, '// Check if searched name is an existing client in our CRM!\nconst clientMatch');
c = c.replace(/\/\/ Check if searched name matches a client or adverse party in any active process! const procMatches/g, '// Check if searched name matches a client or adverse party in any active process!\nconst procMatches');
c = c.replace(/\/\/ Conflict! const reasons/g, '// Conflict!\nconst reasons');
c = c.replace(/\/\/ Clean path! setResults/g, '// Clean path!\nsetResults');
fs.writeFileSync(f, c, 'utf8');

f = 'src/components/principal/CopilotoView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Auto scroll useEffect/g, '// Auto scroll\nuseEffect');
c = c.replace(/\/\/ Prepare context data to feed the Gemini API const contextData/g, '// Prepare context data to feed the Gemini API\nconst contextData');
c = c.replace(/\/\/ Basic formatter to render bold, bullet points, headers elegantly in HTML const formatContent/g, '// Basic formatter to render bold, bullet points, headers elegantly in HTML\nconst formatContent');
c = c.replace(/\/\/ Headers if/g, '// Headers\nif');
c = c.replace(/\/\/ Bullet points if/g, '// Bullet points\nif');
c = c.replace(/\/\/ Number list if/g, '// Number list\nif');
c = c.replace(/\/\/ Empty line if/g, '// Empty line\nif');
c = c.replace(/\/\/ Inline bold parser const parseBold/g, '// Inline bold parser\nconst parseBold');
fs.writeFileSync(f, c, 'utf8');

