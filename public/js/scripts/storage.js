let STORAGE = chrome.storage.local;

window.save = function(obj) {
  e(JSON.stringify({save: obj}, null, ' '));
  return new Promise(resolve => STORAGE.set(obj, () => resolve(true)));
};

window.saveTabMark = async function(name, value = true) {
  let obj = {};
  obj[await getMark(name)] = value;
  return save(obj);
}

window.checkTabMark = async function(name) {
  return await loadAndRemove(await getMark(name));
}

async function getMark(name) {
  let tabId = await getThisTabId();
  return name.toString() + tabId.toString();
}

window.load = function(name) {
  if (name !== 'debug' && (name !== null && name.indexOf('tabReady') === -1)) e(`load ${name}`);
  return new Promise(
    resolve => STORAGE.get(
      name,
      answer => {
        if (typeof name === 'string' && name.indexOf(' ') === -1) {
          if (answer[name]) resolve(answer[name]);
          else resolve(undefined);
        }
        else resolve(answer)
      }
    )
  );
};

window.loadAndRemove = function(name) {
  return new Promise(async resolve => {
    let answer = await load(name);
    if (answer) remove(name).then();
    resolve(answer);
  })
};

window.remove = function(name) {
  //if (name.indexOf('tabReady') === -1) e(`remove ${name}`);
  return new Promise(
    resolve => STORAGE.remove(
      name,
      answer => resolve(answer)
    )
  );
};