import ('./jquery-3.3.1.min.js').then(() => {
  Promise.all([
    import ('./cache.js'),
    import ('./copyCounting.js'),
    //import ('./copyToDiv.js'),
    //import ('./e.js'),
    //import ('./messages.js'),
    import ('./onPath.js'),
    import ('./parsing.js'),
    //import ('./storage.js'),
    //import ('./ajaxInjection.js')
  ]).then(results => {
    let consts = results[0];
    for (let name of Object.keys(consts))
      Object.defineProperty(window, name, {
        value: consts[name],
        writable: false
      });
    if (typeof chrome === 'undefined') chrome = browser;
    //dispatchEvent(new Event('modelIsReady'));
  });
});