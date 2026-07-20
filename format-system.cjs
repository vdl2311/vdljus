const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if(file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./src/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Colors
  content = content.replace(/dark:bg-slate-\d+\/?\d*/g, ''); // Remove arbitrary dark slate backgrounds
  content = content.replace(/dark:border-slate-\d+\/?\d*/g, ''); // Remove arbitrary dark slate borders
  content = content.replace(/dark:text-slate-\d+\/?\d*/g, ''); // Remove arbitrary dark slate texts
  
  content = content.replace(/bg-slate-50/g, 'bg-background');
  content = content.replace(/bg-slate-100/g, 'bg-muted');
  content = content.replace(/bg-slate-900/g, 'bg-card');
  content = content.replace(/bg-slate-950/g, 'bg-background');
  content = content.replace(/bg-white/g, 'bg-card'); // Note: could be dangerous if white is used for text icons, but tailwind bg-white is usually background
  content = content.replace(/text-slate-800/g, 'text-foreground');
  content = content.replace(/text-slate-900/g, 'text-foreground');
  content = content.replace(/text-slate-700/g, 'text-foreground');
  content = content.replace(/text-slate-500/g, 'text-muted-foreground');
  content = content.replace(/text-slate-400/g, 'text-muted-foreground');
  content = content.replace(/text-slate-600/g, 'text-muted-foreground');
  content = content.replace(/text-slate-300/g, 'text-muted-foreground');
  
  content = content.replace(/border-slate-200/g, 'border-border');
  content = content.replace(/border-slate-300/g, 'border-border');
  content = content.replace(/border-slate-800/g, 'border-border');
  content = content.replace(/border-slate-100/g, 'border-border');

  // Specific Design System standardizations
  // Button standard classes: rounded-md
  content = content.replace(/rounded-lg/g, 'rounded-md'); // Often used incorrectly for buttons/inputs instead of md
  // Wait, the design system says: "rounded-md Mais usado — botões, inputs, cards, badges, dialogs"
  // Wait! "Cards: rounded-xl", "Dialog content: rounded-lg", "Tabs container: rounded-lg"
  
  // So replacing all rounded-lg is bad. 
  // Let's just fix specific known bad patterns.
  
  // Clean up double classes like "bg-card dark:bg-card"
  content = content.replace(/dark:bg-card/g, '');
  content = content.replace(/dark:bg-background/g, '');
  content = content.replace(/dark:text-foreground/g, '');
  content = content.replace(/dark:text-muted-foreground/g, '');
  content = content.replace(/dark:border-border/g, '');
  content = content.replace(/bg-card\s+bg-card/g, 'bg-card');
  content = content.replace(/bg-background\s+bg-background/g, 'bg-background');

  if (content !== originalContent) {
    // clean multiple spaces
    content = content.replace(/\s{2,}/g, ' ');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
