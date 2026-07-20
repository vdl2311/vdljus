const fs = require('fs');

let f = 'src/components/dashboard/DashboardView.tsx';
let c = fs.readFileSync(f, 'utf8');
// Dashboard View syntax error:
// It has `};` at the end which shouldn't be there or something?
// Let's remove trailing `};` if it's too many.
let lines = c.split('\n');
while(lines[lines.length - 1].trim() === '};' || lines[lines.length - 1].trim() === '') {
    lines.pop();
}
lines.push('};');
fs.writeFileSync(f, lines.join('\n'), 'utf8');


f = 'src/components/operacao/ProcessoDetalheView.tsx';
c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Fallback date title:/g, '// Fallback date\ntitle:');
c = c.replace(/\/\/ Fallback date\s+title:/g, '// Fallback date\ntitle:');
fs.writeFileSync(f, c, 'utf8');

