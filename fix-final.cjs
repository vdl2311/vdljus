const fs = require('fs');

// CopilotoView
let f = 'src/components/principal/CopilotoView.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Auto\nscroll useEffect/g, '// Auto scroll\nuseEffect');
c = c.replace(/\/\/ Prepare context data to feed the Gemini API\nconst contextData/g, '// Prepare context data to feed the Gemini API\nconst contextData'); // maybe just fix the API one? The error was at `const contextData`. Wait, no, it was `API\nconst contextData`.
c = c.replace(/\/\/ Prepare context data to feed the Gemini\nAPI const contextData/g, '// Prepare context data to feed the Gemini API\nconst contextData');
c = c.replace(/\/\/ Basic formatter to render bold, bullet points, headers elegantly in\nHTML const /g, '// Basic formatter to render bold, bullet points, headers elegantly in HTML\nconst ');
fs.writeFileSync(f, c, 'utf8');

// DashboardView
f = 'src/components/dashboard/DashboardView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ On-the-fly dynamic\nCalculations const /g, '// On-the-fly dynamic Calculations\nconst ');
c = c.replace(/\/\/ Finance metrics for current\nmonth const /g, '// Finance metrics for current month\nconst ');
c = c.replace(/\/\/ Simulated agent\nthoughts const /g, '// Simulated agent thoughts\nconst ');
c = c.replace(/\/\/ Run custom sequential log\nanimations const /g, '// Run custom sequential log animations\nconst ');
c = c.replace(/\/\/ Areas calculation for\nchart const /g, '// Areas calculation for chart\nconst ');
fs.writeFileSync(f, c, 'utf8');

// ContratosView
f = 'src/components/documentos/ContratosView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Create and save signed\ndocument const docTitle/g, '// Create and save signed document\nconst docTitle');
fs.writeFileSync(f, c, 'utf8');

// ProcessoDetalheView
f = 'src/components/operacao/ProcessoDetalheView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Add movements that don't already exist\nif /g, '// Add movements that don\'t already exist\nif ');
c = c.replace(/\/\/ Add movements that don't already\nexist if /g, '// Add movements that don\'t already exist\nif ');
c = c.replace(/\/\/ Convert date formatting\nif needed, but keeping standard const /g, '// Convert date formatting if needed, but keeping standard\nconst ');
c = c.replace(/\/\/ DD\/MM\/YYYY to\nYYYY-MM-DD addMovement/g, '// DD/MM/YYYY to YYYY-MM-DD\naddMovement');
c = c.replace(/\/\/ Trigger DataJud\nImport const /g, '// Trigger DataJud Import\nconst ');
c = c.replace(/\/\/ Record Sync Audit\nLog addSyncLog/g, '// Record Sync Audit Log\naddSyncLog');
c = c.replace(/\/\/ Update last sync\ndate updateProcess/g, '// Update last sync date\nupdateProcess');
c = c.replace(/\/\/ AI Summary\ngeneration const /g, '// AI Summary generation\nconst ');
fs.writeFileSync(f, c, 'utf8');

// ConflitoInteresseView
f = 'src/components/gestao/ConflitoInteresseView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Check if searched name is an existing client in our\nCRM! const /g, '// Check if searched name is an existing client in our CRM!\nconst ');
c = c.replace(/\/\/ Check if searched name matches a client or adverse party in any active\nprocess! const /g, '// Check if searched name matches a client or adverse party in any active process!\nconst ');
c = c.replace(/\/\/ Conflict! const /g, '// Conflict!\nconst ');
c = c.replace(/\/\/ Clean path! setResults/g, '// Clean path!\nsetResults');
fs.writeFileSync(f, c, 'utf8');

