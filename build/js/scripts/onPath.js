let watch;
window.onPath = function(regExp, once = false, fn) {
  if (typeof once === 'function') {
    fn = once;
    once = false;
  }
  window.addEventListener('locationChange', function eventListener() {
    let result = regExp.exec(location.pathname + location.search);
    if (result) {
      fn.call(window, result);
      if (once) window.removeEventListener('locationChange', eventListener);
    }
  });
  $(() => {window.dispatchEvent(new CustomEvent('locationChange'));});
};

let oldHref;
function watchForLocationChange() {
  $(() => {
    oldHref = document.location.href;
    setInterval(() => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        window.dispatchEvent(new CustomEvent('locationChange'));
      }
    }, 50);
  });
}
watchForLocationChange();