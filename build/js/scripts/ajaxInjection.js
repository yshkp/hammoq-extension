const className = 'LPE_AjaxOutputRedirect';
const SCRIPT = "\n" +
  "const _XMLHttpRequest = XMLHttpRequest;\n" +
  "XMLHttpRequest = function() {\n" +
  "  let ret = new _XMLHttpRequest();\n" +
  "  ret.addEventListener('load', data => {\n" +
  "    if (ret.readyState === ret.DONE) {\n" +
  "      let div = document.createElement('div');\n" +
  `      div.className = '${className}';\n` +
  "      div.style.display = 'none';\n" +
  "      div.innerText = ret.response;\n" +
  "      div.dataset.url = ret.responseURL;\n" +
  "      document.body.insertBefore(div, null);\n" +
  "      setTimeout(() => {div.remove()}, 10000);\n" +
  "    }\n" +
  "  });\n" +
  "  return ret;\n" +
  "};";

const node = document.createElement('script');
node.innerText = SCRIPT;
node.type = "text/javascript";
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertBefore(node, null);
});

window.getAjaxOutput = function(regExp) {
  let outputs = $('.' + className);
  let ret = [];
  for (let output of outputs)
    if (regExp.test(output.dataset.url))
      ret.push({url: output.dataset.url, text: output.innerText});
  return ret;
};

window.clearAjaxOutputs = function() {
  $('.' + className).remove();
};

/* SCRIPT TEXT:
const _XMLHttpRequest = XMLHttpRequest;
XMLHttpRequest = function() {
  let ret = new _XMLHttpRequest();
  ret.addEventListener('load', data => {
    if (ret.readyState === ret.DONE) {
      let div = document.createElement('div');
      div.className = 'LPE_AjaxRedirected';
      div.style.display = 'none';
      div.innerText = ret.response;
      div.dataset.url = ret.responseURL;
      document.body.insertBefore(div, null);
      setTimeout(() => {div.remove()}, 10000)
    }
  });
  return ret;
};
 */