const fs = require('fs');

let f = 'src/components/dashboard/DashboardView.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/if lastMovementDate is earlier than 90 days ago, or if it is statically stagnant const stagnantProcesses/g, '// if lastMovementDate is earlier than 90 days ago, or if it is statically stagnant\nconst stagnantProcesses');
// Let's also check if there is any other `if lastMovementDate is earlier than 90 days ago, or if it is statically stagnant` without const
c = c.replace(/\/\/ Let's assume if lastMovementDate is empty, it's new\s*if lastMovementDate/g, '// Let\'s assume if lastMovementDate is empty, it\'s new\n// if lastMovementDate');

fs.writeFileSync(f, c, 'utf8');

