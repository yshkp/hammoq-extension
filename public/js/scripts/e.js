//Blackbox it
window.e = function() {
  if (!DEBUG) return;
  applyToConsole(getStyles('#213f64'), arguments);
};

window.ev = function(out) {
  e(out + ' LP version: ' + chrome.runtime.getManifest().version)
};

window.er = function() {
  if (!DEBUG) return;
  applyToConsole(getStyles('red'), arguments);
};

function applyToConsole(styles, inc) {
  let args = ['%cLP%c', styles[0], styles[1]];
  let argsStrs = [];
  let argsObjs = [];
  for (let i of Object.keys(inc)) {
    let arg = inc[i];
    if (typeof arg === 'object') argsObjs.push(arg);
    else argsStrs.push(arg);
  }
  args[0] += argsStrs.join(' ');
  for (let obj of argsObjs) args.push(obj);
  console.log.apply(null, args);
}

function getStyles(color) {
  return [
    `font-family:"Roboto Mono Medium";margin-right: 4px;background-color:${color};` +
     'padding: 2px 2px 0px 2px;border:1px solid transparent;border-radius:50%;font-size:10px;',
    'font-family:"Roboto Mono Medium";line-height:15px;color:white'
  ];
}