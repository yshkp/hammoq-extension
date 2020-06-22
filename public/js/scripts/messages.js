function isBackground() {
  return typeof IS_BACKGROUND !== "undefined" && IS_BACKGROUND;
}

window.tabsQuery = function(query = {}) {
  if (isBackground()) return new Promise(resolve => {
    chrome.tabs.query(query, tabs => resolve(tabs));
  });
  else return sendOverConnection({action: 'tabsQuery', query: query});
};

window.closeMe = function() {
  if (isBackground()) chrome.tabs.remove(arguments[0]);
  else sendOverConnection({action:'closeMe'});
};

window.getListPerfectlyTab = async function() {
  if (isBackground()) {
    const {listperfectly} = shops;
    let regExp = listperfectly.productItemRegExp;
    let activeTab = await getActiveTab();
    if (regExp.test(activeTab.url)) return activeTab;
    else {
      let tabs = (await tabsQuery({})).filter(tab => regExp.test(tab.url));
      return tabs.length > 0 ? tabs[0] : false;
    }
  }
  else return sendOverConnection({action: 'getListPerfectlyTab'});
};

window.getListPerfectlyEditTab = async function() {
  if (isBackground()) {
    let tabs = (await tabsQuery({}))
      .filter(tab => shops.listperfectly.regExp.test(tab.url));
    return tabs.length > 0 ? tabs[0] : false;
  }
  else return sendOverConnection({action: 'getListPerfectlyEditTab'});
};

window.copyFromTo = function(shops, hrefs, ignoreTabId) {
  if (isBackground()) return new Promise(async resolve => {
    let fields = await getUserRestrictions();
    if (fields.length === 0) {
      resolve(false);
      return;
    }
    let promises = [];
    let isSetFirstTabPriority = false;
    let performParallel = false;
    for (let href of hrefs) {
      let promise = new Promise(async resolve => {
        let tab = await createTabReady(href, false);
        let data = await getData(tab.id);
        if (!data) {
          //todo throw error
          resolve(false);
          return;
        }
        await new Promise(resolve => chrome.tabs.remove(tab.id, () => resolve(true)));
        //await wait(300); //dunno why, but tab can be still not closed when resolve() called
        data = filterByRestrictions(data, fields);
        let promises = [];
        for (let shop of shops) {
          if (shop === 'listperfectly') resolve(data);
          else {
            let promise = new Promise(async resolve => {
              let isActive = false;
              if (!isSetFirstTabPriority) {
                isSetFirstTabPriority = true;
                isActive = true;
              }
              let destTab = await getShopTab(shop, false, isActive, ignoreTabId);
              setData(destTab.id, data).then();
              resolve(true);
            });
            promises.push(performParallel ? promise : await promise);
          }
        }
        Promise.all(promises).then(() => resolve(true));
      });
      promises.push(performParallel ? promise : await promise);
    }
    Promise.all(promises).then(async datas => {
      if (shops.indexOf('listperfectly') > -1) {
        for (let data of datas) {
          let destTab = await getShopTab('listperfectly', true, false);
          await setData(destTab.id, data);
        }
      }
      resolve(true)
    });
  });
  else return sendOverConnection({action: 'copyFromTo', hrefs: hrefs, shops: shops});
};

window.login = function(username, password) {
  if (isBackground()) {
    return new Promise(resolve => {
      $.ajax({
        url: `https://${LP_DOMAIN}/wp-json/jwt-auth/v1/token`,
        method: 'POST',
        data: {username: username, password: password}
      }).always((result, textStatus) => {
        if (textStatus === 'success') {
          save({token: result.token});
          resolve(true);
        }
        else resolve(false);
      }).then(r => {});
    });
  }
  else return sendOverConnection({action: 'login', username: username, password: password});
};

window.isLoggedIn = function() {
  if (isBackground()) {
    return new Promise(async resolve => {
      let debugValue = await getDebug('isLoggedIn');
      if (typeof debugValue !== 'undefined') {
        resolve(debugValue);
        return;
      }
      let token = await getToken();
      if (!token) resolve(false);
      else $.ajax({
        url: `https://${LP_DOMAIN}/wp-json/jwt-auth/v1/token/validate`,
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        contentType: "application/json",
        complete: (jqXHR, textStatus) => {
          if (textStatus === 'success') resolve(true);
          else {
            remove('token');
            resolve(false);
          }
        }
      });
    })
  }
  else return sendOverConnection({action: 'isLoggedIn'});
};

window.getUserProducts = function() {
  if (isBackground()) {
    return new Promise(async resolve => {
      $.ajax({
        url: `https://${LP_DOMAIN}/wp-json/lpcustom/v1/userproducts`,
        contentType: "application/json",
        headers: {Authorization: 'Bearer ' + (await getToken())},
      }).then(json => resolve(json));
    });
  }
  else return sendOverConnection({action: 'getUserProducts'});
};

window.setForeignId = function(gform_id, resource, foreignId) {
  if (isBackground()) {
    return new Promise(async resolve => {
      let data = {ID: gform_id};
      data[resource] = foreignId;
      $.ajax({
        url: `https://${LP_DOMAIN}/wp-json/lpcustom/v1/updmarket`,
        method: 'post',
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {Authorization: 'Bearer ' + (await getToken())},
      }).then(() => {
        riseCopyCounter().then();
        resolve(true);
      });
    });
  }
  else return sendOverConnection({
    action: 'setForeignId', resource: resource, id: gform_id, foreignId: foreignId
  })
};

window.getForeignSourcesAll = function() {
  if (isBackground()) {
    return new Promise(async resolve => {
      $.ajax(`https://${LP_DOMAIN}/listing-ids/`, {
        success: html => {
          html = $(html);
          let table = html.find('table.gv-table-view');
          let tbody = table.find('tbody');
          let trs = tbody.find('tr');
          let rows = [];
          for (let tr of trs) {
            let tds = $(tr).find('td');
            rows.push({
              ID: tds.eq(0).text(),
              gform_id: tds.eq(1).text(),
              market_fields: {
                ebay: tds.eq(3).text(),
                etsy: tds.eq(4).text(),
                poshmark: tds.eq(5).text(),
                mercari: tds.eq(6).text(),
                tradesy: tds.eq(7).text(),
                relovv: tds.eq(8).text(),
                grailed: tds.eq(9).text(),
                facebook: tds.eq(10).text(),
                depop: tds.eq(11).text()
              }
            });
          }
          resolve(rows);
        }
      })
    })
  }
  else return sendOverConnection({action: 'getForeignSourcesAll'});
};

window.getForeignSourcesByShop = async function(source) {
  if (isBackground()) {
    let sources = await getForeignSourcesAll();
    let ret = [];
    for (let row of sources) {
      let id = row.market_fields[source];
      if (id) ret.push(id);
    }
    return (ret);
  }
  else return sendOverConnection({action: 'getForeignSourcesByShop', source: source});
};

window.getForeignSourcesById = async function(id) {
  if (isBackground()) {
    id = parseInt(id);
    let sources = await getForeignSourcesAll();
    for (let row of sources) if (parseInt(row.ID) === id) return row.market_fields;
  }
  else return sendOverConnection({action: 'getForeignSourcesById', id: id})
};

let getListingsByGformId_array = async function(gform_ids) {
  if (isBackground()) {
    let sources = await getForeignSourcesAll();
    let ret = [];
    for (let gform_id of gform_ids) {
      gform_id = parseInt(gform_id);
      for (let row of sources)
        if (parseInt(row.gform_id) === gform_id) ret.push(row);
    }
    return ret;
  }
  else return sendOverConnection({action: 'getListingsByGformId_array',
    gform_ids: gform_ids});
};

window.setSoldByGformId_array = async function(gform_ids) {
  if (isBackground()) {
    let listings = await getListingsByGformId_array(gform_ids);
    for (let listing of listings) {
      setSoldForeignItems(listing.market_fields).then();
      setSoldStatus(listing.gform_id, true).then();
    }
  }
  else return sendOverConnection({action: 'setSoldByGformId_array',
    gform_ids: gform_ids});
};

window.getThisTabId = async function() {
  return sendOverConnection({action: 'getThisTabId'});
};

window.setSold = function(id) {
  if (isBackground()) return new Promise(async resolve => {
    let foreignIds = await getForeignSourcesById(id);
    resolve(true);
    setSoldForeignItems(foreignIds).then();
  });
  else return sendOverConnection({action: 'setSold', id: id});
};

window.setSoldByForeignId = function(foreign) {
  if (isBackground()) return new Promise(async resolve => {
    let role = await getUserRole();
    if (role === 'Simple') {
      resolve(true);
      return;
    }
    let items = await getForeignSourcesAll();
    let foreignIds;
    for (let item of items) {
      if (item.market_fields[foreign.shop] === foreign.id.toString()) {
        foreignIds = item.market_fields;
        setSoldStatus(item.gform_id).then();
        break;
      }
    }
    resolve(true);
    if (!foreignIds) return;
    setSoldForeignItems(foreignIds, foreign.stop).then();
  });
  return sendOverConnection({action: 'setSoldByForeignId', foreign: foreign});
};

window.setSoldStatus = async function(gform_id, status = true) {
  if (isBackground()) return new Promise(async resolve => {
    $.ajax({
      url: `https://${LP_DOMAIN}/wp-json/lpcustom/v1/updmarket`,
      method: 'post',
      data: JSON.stringify({'ID': gform_id, 'sold': status + 0}),
      contentType: "application/json",
      headers: {Authorization: 'Bearer ' + (await getToken())},
    }).then(() => resolve(true));
  });
  else return sendOverConnection({action: 'setSoldStatus', gform_id: gform_id, status: true});
};

window.copyTo = function(shop) {
  if (isBackground()) return new Promise(async resolve => {
    let lpTab = await getListPerfectlyTab();
    let data = await getData(lpTab.id);
    if (data) {
      resolve(true);
      let destTab = await getShopTab(shop, false, true, null, true);
      await setData(destTab.id, data);
    }
    else resolve(false);
  });
  else return sendOverConnection({action: 'copyTo', shop: shop})
};

if (isBackground()) {
  window.getData = function (tabId) {
    return sendOverConnection({action: 'getData'}, tabId);
  };
  window.setData = function (tabId, data) {
    return sendOverConnection({action: 'setData', data: data}, tabId);
  };
}

window.deleteListing = function(tabId) {
  return sendOverConnection({action: 'deleteListing'}, tabId);
};

window.reloadCopyButtons = function() {
  if (isBackground()) {
    return new Promise(async resolve => {
      chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
          for (let shop of Object.keys(shops)) {
            if (shops[shop].listRegExp.test(tab.url)) {
              sendOverConnection({action: 'reloadCopyButtons'}, tab.id);
              break;
            }
          }
        }
      });
      resolve(true);
    });
  }
  else return sendOverConnection({action: 'reloadCopyButtons'})
};

window.setWaitCopyButtons = function() {
  if (isBackground()) {
    return new Promise(async resolve => {
      chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
          for (let shop of Object.keys(shops)) {
            if (shops[shop].listRegExp.test(tab.url)) {
              sendOverConnection({action: 'setWaitCopyButtons'}, tab.id);
              break;
            }
          }
        }
      });
      resolve(true);
    });
  }
  else return sendOverConnection({action: 'setWaitCopyButtons'})
};

window.setWaitingForButtonsReload = function() {
  chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(async message => {
      if (message.action === 'reloadCopyButtons') {
        await save({reloadingButtons: true});
        addButtonsPreprocess().then(() => {addButtons()});
      }
      else if(message.action === 'setWaitCopyButtons') {
        $('.LPE_Button').attr('disabled', 'disabled');
      }
    })
  });
};

window.saveForeignIdsOnBypass = async function(sources) {
  if (isBackground()) {
    let data = {
      is_submit_23: 1,
      gform_submit: 23,
      gform_target_page_number_23: 0,
      gform_source_page_number_23: 1,
      input_834: '',
      input_1: ''
    };
    for (let name of Object.keys(sources)) {
      let value = sources[name];
      switch(name) {
        case 'ebay':
          data.input_618 = value;
          break;
        case 'etsy':
          data.input_619 = value;
          break;
        case 'poshmark':
          data.input_620 = value;
          break;
        case 'mercari':
          data.input_621 = value;
          break;
        case 'tradesy':
          data.input_833 = value;
          break;
        case 'grailed':
          data.input_839 = value;
          break;
        case 'depop':
          data.input_841 = value;
          break;
        case 'facebook':
          data.input_840 = value;
          break;
        case 'title':
          data.input_834 = value;
          break;
        case 'SKU':
          data.input_1 = value;
          break;
      }
    }
    if (Object.keys(data).length < 10) {
      let error = JSON.stringify([
        'Object.keys(data).length < 8 in saveForeignIdsOnBypass',
        data,
        sources,
        chrome.runtime.getManifest().version
      ]);
      sendDebug(error).then();
    }
    return new Promise(async resolve => {
      $.ajax({
        url: `https://${LP_DOMAIN}/copied-listings/`,
        method: 'POST',
        data: data,
      }).always((response, status) => {
        e(status);
        resolve(true);
        riseCopyCounter();
      });
    });
  }
  else return sendOverConnection({action: 'saveForeignIdsOnBypass', sources: sources})
};

window.callback = function(message, tabId) {
  if (isBackground()) chrome.tabs.sendMessage(tabId, message);
  else return sendOverConnection({action:'callback', message: message});
};

window.refreshLogin = function() {
  if (isBackground()) return new Promise(resolve => {
    let logoutURL = `https://${LP_DOMAIN}/wp-login.php?action=logout` +
      `&redirect_to=https%3A%2F%2F${LP_DOMAIN}%2Flogin`;
    $.ajax({url: logoutURL}).always(obj => {
      let logoutURL = /href="(.+?)"/.exec(obj.responseText)[1].replace(/&amp;/g, '&');
      $.ajax({url: logoutURL}).then(() => {
        window.open(`https://${LP_DOMAIN}/login`, '_blank');
        resolve(true);
      });
    }).then(() => {});
  });
  else return sendOverConnection({action: 'refreshLogin'});
};

window.getUserRole = function() {
  if (isBackground()) return new Promise(async resolve => {
    let debugValue = await getDebug('userRole');
    if (typeof debugValue !== 'undefined') {
      resolve(debugValue);
      return true;
    }
    let cached = loadCached('userRole');
    if (cached) {
      resolve(cached);
      return true;
    }
    $.ajax({
      url: `https://${LP_DOMAIN}/copied-listings/`,
      method: 'GET'
    }).then(html => {
      html = $(html);
      if (html.find('[href="https://app.listperfectly.com/"]').length === 3) {
        resolve(false); //not logged in actualy
        return;
      }
      let inputs = html.find('li:not([style])').find('input[type=text], select, textarea');
      if (inputs.length === 0) {
        resolve('Subscriber');
        return;
      }
      let role = inputs.filter('[name=input_835]').val();
      if (role.indexOf('Pro') > -1) role = 'Pro';
      else if (role.indexOf('Business') > -1) role = 'Business';
      else if (role.indexOf('Simple25') > -1 && role.indexOf('Simple250') === -1) role = 'Simple25';
      else if (role.indexOf('Simple') > -1) role = 'Simple';
      else role = 'Subscriber';
      cache('userRole', role);
      resolve(role);
    });
  });
  else return sendOverConnection({action: 'getUserRole'});
};

window.addImageToLP = function(url) {
  if (isBackground()) return new Promise(resolve => {
    getListPerfectlyEditTab().then(tab => {
      resolve(sendOverConnection({action: 'addImage', url: url}, tab.id));
    });
  });
  else return sendOverConnection({action: 'addImageToLP', url: url});
};

async function setSoldForeignItems(foreignIds, skipShop = null) {
  for (let shop of Object.keys(foreignIds)) {
    let foreignId = foreignIds[shop];
    if (!foreignId) continue;
    if (skipShop === shop) continue;
    switch(shop) {
      case 'ebay':
        await save({ebayDeleteId: foreignId});
        break;
      case 'mercari':
        if (foreignId[0] !== 'm') foreignId = 'm' + foreignId.toString();
        break;
      case 'tradesy':
        await save({deleteTradesyId: foreignId});
        break;
    }
    let tab = await createTabReady(shops[shop].hrefFromId(foreignId));
    deleteListing(tab.id).then();
  }
}

function sendOverConnection(message, tabId = 'BG', waitForAnswer = true) {
  let port = tabId === 'BG' ? chrome.runtime.connect() : chrome.tabs.connect(tabId);
  return new Promise(resolve => {
    port.postMessage(message);
    port.onMessage.addListener(function a(answer) {
      port.disconnect();
      if (answer.error) {
        e("From " + tabId + ' ' + answer.error, 1);
        e([message],1);
      }
      if (waitForAnswer) resolve(answer);
    });
    if (!waitForAnswer) resolve(true);
  });
}

function getToken() {
  return load('token');
}

window.sendDebug = async function (text) {
  $.ajax({
    url: 'https://app.listperfectly.com/wp-json/lpcustom/v1/debugmessage',
    method: 'POST',
    headers: {Authorization: `Bearer ` + await getToken()},
    data: JSON.stringify({message: text}),
    contentType: "application/json",
    complete: (jqXHR, textStatus) => {
      console.log(jqXHR, textStatus);
    }
  });
}