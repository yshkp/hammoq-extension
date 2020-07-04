window.getActiveTab = async function() {
  return (await tabsQuery({active: true}))[0];
};

let usedTabs = [];
window.getShopTab = function(shop, forceNew = false, active = true, ignoreTabId) {
  return new Promise(async resolve => {
    let tabs = [];
    let ret;
    if (!forceNew) tabs = (await tabsQuery({})).filter(tab => shops[shop].regExp.test(tab.url));
    if (tabs.length > 0) {
      for (let tab of tabs) {
        if (usedTabs.indexOf(tab.id) === -1) {
          if (tab.id === ignoreTabId) continue;
          ret = tab;
          break;
        }
      }
    }
    if (!ret) ret = await createTabReady(shops[shop].link, active);
    usedTabs.push(ret.id);
    resolve(ret);
  });
};

window.createTabReady = function(href, active = true) {
  return new Promise(async resolve => {
    let newTab = await new Promise(resolve =>
      chrome.tabs.create({active: active, url: href}, tab => {
        usedTabs.push(tab.id);
        resolve(tab)
      })
    );
    /*
    chrome.tabs.onUpdated.addListener(function fnc(tabId, changeInfo) {
      if (tabId === newTab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(fnc);
        resolve(newTab);
      }
    });
    */
    let interval = setInterval(async () => {
      let result = await loadAndRemove('tabReady' + newTab.id);
      if (result) {
        clearInterval(interval);
        resolve(newTab);
      }
    }, 50);
  });
};

window.getUserRestrictions = async function() {
  let role = await getUserRole();
  let ids = [];
  switch (role) {
    case 'Pro':
      ids = ['834','206','209','82','213','505','205','210','36','43','211','17','453','22',
        '104','1','704', '2','531','532','533', '837'];
      break;
    case 'Business':
      ids = ['834','206','209','82','213','505','453','22','104','1','704'];
      break;
    case 'Simple':
      ids = ['834','505'];
      break;
    case 'Subscriber':
    case false:
      ids = [];
      break;
  }
  if (ids.length === 0) return [];
  let fields = ['images', 'from', 'id', 'gform_id'];
  for (let id of ids) fields.push(listPerfectlyFields[id]);
  return fields;
};

window.filterByRestrictions = function(data, fields) {
  for (let name of Object.keys(data))
    if (fields.indexOf(name) === -1)
      delete data[name];
  return data;
};

let showMessageLoadedHtml = false;
let showMessageTimeout = null;
window.showMessage = async function(message) {
  if (!showMessageLoadedHtml) {
    $('<div id="LPE_message"></div>')
      .click(function() {
        $(this).removeClass('visible');
        clearTimeout(showMessageTimeout);
      })
      .appendTo('body');
    await getExtensionLess('css/_common.less');
    showMessageLoadedHtml = true;
  }
  let div = $('#LPE_message');
  clearTimeout(showMessageTimeout);
  div.removeClass('visible');
  await wait(1);
  div.html(message).addClass('visible');
  showMessageTimeout = setTimeout(() => {div.removeClass('visible')}, 5000);
}

window.getDebug = async function(value) {
  if (!DEBUG) return undefined;
  let debugValues = await load('debug');
  if (debugValues) return debugValues[value];
  else return undefined;
};

window.setDebug = async function(name, value) {
  if (!DEBUG) return undefined;
  let debugValues = await load('debug');
  if (debugValues) debugValues[name] = value;
  else {
    debugValues = {};
    debugValues[name] = value;
  }
  await save({debug: debugValues})
};

window.removeDebug = async function(name) {
  if (!DEBUG) return undefined;
  let debugValues;
  if (name) {
    debugValues = await load('debug');
    delete debugValues[name];
  }
  else debugValues = {};
  await save({debug: debugValues});
};