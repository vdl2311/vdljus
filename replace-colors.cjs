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

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace background and text colors
  content = content.replace(/bg-slate-50 dark:bg-slate-950/g, 'bg-background');
  content = content.replace(/bg-white dark:bg-slate-900/g, 'bg-card');
  content = content.replace(/bg-slate-950/g, 'bg-background');
  content = content.replace(/bg-slate-900/g, 'bg-card');
  content = content.replace(/text-slate-800 dark:text-slate-100/g, 'text-foreground');
  content = content.replace(/text-slate-900 dark:text-slate-50/g, 'text-foreground');
  content = content.replace(/text-slate-800 dark:text-slate-200/g, 'text-card-foreground');
  content = content.replace(/text-slate-800/g, 'text-foreground');
  content = content.replace(/text-slate-900/g, 'text-foreground');
  // Avoid replacing text-white inside explicit colored blocks like text-white inside a red banner? 
  // Let's only replace common slate shades
  
  // Replace muted/subtle text
  content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-muted-foreground');
  content = content.replace(/text-slate-400 dark:text-slate-500/g, 'text-muted-foreground');
  content = content.replace(/text-slate-500/g, 'text-muted-foreground');
  content = content.replace(/text-slate-400/g, 'text-muted-foreground');
  content = content.replace(/text-slate-600 dark:text-slate-300/g, 'text-muted-foreground');
  content = content.replace(/text-slate-600/g, 'text-muted-foreground');
  content = content.replace(/text-slate-700/g, 'text-foreground');
  content = content.replace(/text-slate-300/g, 'text-muted-foreground');
  content = content.replace(/text-slate-200/g, 'text-card-foreground');
  
  // Replace borders
  content = content.replace(/border-slate-200 dark:border-slate-800/g, 'border-border');
  content = content.replace(/border-slate-100 dark:border-slate-800/g, 'border-border');
  content = content.replace(/border-slate-200 dark:border-slate-700/g, 'border-border');
  content = content.replace(/border-slate-200/g, 'border-border');
  content = content.replace(/border-slate-800/g, 'border-border');
  content = content.replace(/border-slate-100/g, 'border-border');
  content = content.replace(/border-slate-700/g, 'border-border');

  // Replace hover states
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-slate-800/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-slate-950/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:bg-slate-100/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:bg-slate-800/g, 'hover:bg-accent hover:text-accent-foreground');
  content = content.replace(/hover:text-slate-600 dark:hover:text-slate-300/g, ''); // Handled by accent
  content = content.replace(/hover:text-slate-800 dark:hover:text-white/g, 'hover:text-foreground');
  content = content.replace(/hover:text-slate-800/g, 'hover:text-foreground');
  
  // Replace structural backgrounds
  content = content.replace(/bg-slate-100 dark:bg-slate-800/g, 'bg-muted');
  content = content.replace(/bg-slate-100/g, 'bg-muted');
  content = content.replace(/bg-slate-800/g, 'bg-muted');
  content = content.replace(/bg-slate-50 dark:bg-slate-950\/80/g, 'bg-muted/50');
  content = content.replace(/bg-slate-50 dark:bg-slate-900\/50/g, 'bg-muted/30');
  content = content.replace(/bg-slate-50/g, 'bg-muted');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
