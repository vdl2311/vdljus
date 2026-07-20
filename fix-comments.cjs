const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/components/**/*.tsx').concat(glob.sync('src/components/*.tsx'));

let total = 0;
files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let original = code;
  
  // Here I will manually add the replacements based on the grep output.
  // We can do standard heuristics:
  // match // (some words) (const|let|return|if|set|add|scroll|})
  
  code = code.replace(/\/\/ On-the-fly dynamic Calculations const /g, '// On-the-fly dynamic Calculations\nconst ');
  code = code.replace(/\/\/ Finance metrics for current month const /g, '// Finance metrics for current month\nconst ');
  code = code.replace(/\/\/ Stagnant processes \(>90 days\)/g, '\n// Stagnant processes (>90 days)');
  code = code.replace(/\/\/ Let's assume if lastMovem(.*?)\n/g, '// Let\'s assume if lastMovem$1\n'); // wait, the original string was "lastMovement... return"
  
  // Actually, I can use a regex:
  // \/\/ ([A-Za-z0-9 \-'"\(\)>:,]+?)\s+(const |let |return |if |set[A-Z]|add[A-Z]|scroll|})
  code = code.replace(/\/\/ ([A-Za-z0-9 \-'"\(\)>:,!.\/]+?)\s+(const |let |return |if |set[A-Z]|add[A-Z]|scroll|}|\[)/g, '// $1\n$2');
  
  if(code !== original) {
     fs.writeFileSync(file, code, 'utf8');
     console.log('Fixed some in', file);
  }
});
