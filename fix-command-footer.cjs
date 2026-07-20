const fs = require('fs');
const file = 'src/components/CommandPalette.tsx';
let code = fs.readFileSync(file, 'utf8');

// Hide keyboard shortcuts on mobile
code = code.replace(/<div className="flex justify-center gap-3 mt-4 text-\[10px\] text-muted-foreground">/g, '<div className="hidden sm:flex justify-center gap-3 mt-4 text-[10px] text-muted-foreground">');

// Also hide the bottom footer keyboard hint on mobile
code = code.replace(/<span className="flex items-center gap-1">/g, '<span className="hidden sm:flex items-center gap-1">');

fs.writeFileSync(file, code, 'utf8');
