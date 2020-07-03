import("./utils/_.js").then(() => {
  console.log("scripts imported ");
  addEventListener('modelIsReady', () => {
      /** @var CONTENT_SCRIPTS object */
      onPath(/./, () => {
        let href = location.href.replace('https://', '');
        for (let i of Object.keys(CONTENT_SCRIPTS)) {
          let script = CONTENT_SCRIPTS[i];
          for (let re of script.regExp) {
            if (re.test(href)) {
              if (script.imported) continue;
              let imported = p + script.path;
              ev(script.path);
              import(imported).then(
                async () => {
                  let obj = {};
                  let name = 'tabReady' + await getThisTabId();
                  obj[name] = true;
                  await save(obj);
                  window.addEventListener('beforeunload', () => {remove(name)});
                  });
              CONTENT_SCRIPTS[i].imported = true;
              break;
            }
          }
        }
      });
    });
});
