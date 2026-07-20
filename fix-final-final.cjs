const fs = require('fs');

let f = 'src/components/operacao/ProcessoDetalheView.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\/\/ Unify Timeline entries\s*const timelineEntries/g, '// Unify Timeline entries\nconst timelineEntries');
fs.writeFileSync(f, c, 'utf8');

f = 'src/components/documentos/ContratosView.tsx';
c = fs.readFileSync(f, 'utf8');
// remove trailing extra }; lines
let lines = c.split('\n');
while(lines[lines.length - 1].trim() === '};' || lines[lines.length - 1].trim() === '') {
    lines.pop();
}
// add exactly one }; back just in case
lines.push('};');
fs.writeFileSync(f, lines.join('\n'), 'utf8');

