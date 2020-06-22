window.wait = function (ms) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms));
};

/**
 * @returns {Promise<jQuery>}
 */
window.waitForNode = function (selector, maxWait, inNode) {
  if (!inNode) inNode = $(document.body);
  let maxDate = null;
  if (maxWait) {
    maxDate = new Date();
    maxDate.setSeconds(maxDate.getSeconds() + maxWait);
  }
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      let node = inNode.find(selector);
      if (node.length > 0) {
        clearInterval(interval);
        resolve(node);
      }
      if (maxDate && new Date() > maxDate) {
        clearInterval(interval);
        resolve(false);
      }
    }, 50);
  });
};

window.waitForNodeDisappear = function (selector) {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      let node = typeof selector === "object" ? selector : $(selector);
      if (node.closest(document.documentElement).length === 0) {
        clearInterval(interval);
        resolve(true);
      }
    }, 50);
  });
};
window.waitForDocumentReady = function () {
  return new Promise((resolve) => {
    $(() => resolve(true));
  });
};

const STATES = []; //refactor to events?
window.waitForState = function (variable, value, ignoreDate = false) {
  e(`Waiting for state ${variable} = ${value}, ${ignoreDate}`);
  let fromTime = new Date();
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      if (STATES[variable] === undefined) return;
      if (!ignoreDate && STATES[variable].time < fromTime) return;
      if (value !== undefined && STATES[variable].value !== value) return;
      clearTimeout(interval);
      e(`State ${variable} = ${STATES[variable].value}`);
      resolve(STATES[variable].value);
    }, 10);
  });
};
window.setState = function (name, value) {
  STATES[name] = { time: new Date(), value: value };
};

window.getDataTransfer = function (images, resize = null) {
  if (!getDataTransfer.rndStr) {
    let str = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    getDataTransfer.rndStr = "";
    for (let i = 0; i < 8; i++)
      getDataTransfer.rndStr += str[Math.round(Math.random() * str.length)];
  }
  if (!getDataTransfer.counter) getDataTransfer.counter = 0;
  if (!getDataTransfer.uploads) getDataTransfer.uploads = [];
  let uploadId = getDataTransfer.uploads.length;
  getDataTransfer.uploads[uploadId] = true;
  if (!getDataTransfer.ajaxHTML) {
    (() => {
      getExtensionSource("html/getDataTransferLoading.html").then((html) => {
        $(html).appendTo($("body"));
        getDataTransfer.ajaxHTML = $("#LPE_GDTL_Loading");
        getDataTransfer.ajaxHTML.addClass("visible");
      });
      getExtensionLess("css/getDataTransferLoading.less").then();
    })();
  } else getDataTransfer.ajaxHTML.addClass("visible");
  return new Promise((resolve) => {
    //NOT LP_DOMAIN const, there is an API.php only in 1 place
    $.ajax({
      url: `https://app.listperfectly.com/API.php`,
      data: { action: "downloadImages", images: images },
      method: "post",
      xhr: () => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener(
          "progress",
          function (e) {
            let total = e.target.getResponseHeader(
              "x-decompressed-content-length"
            );
            let percentComplete = e.loaded / total;
            //e(percentComplete);
            //todo no data about total is always 0
          },
          false
        );
        return xhr;
      },
    }).then(async (data) => {
      getDataTransfer.uploads[uploadId] = false;
      if (Math.max(...getDataTransfer.uploads) === 0)
        getDataTransfer.ajaxHTML.removeClass("visible");
      data = JSON.parse(data);
      let transfer = new DataTransfer();
      for (let str of data) {
        if (resize) {
          let img = new Image();
          img.src = "data:image/jpeg;base64," + str;
          let dim = await new Promise(
            (resolve) =>
              (img.onload = () =>
                resolve({
                  w: img.width,
                  h: img.height,
                }))
          );
          let ratio = dim.w / dim.h;
          if (resize.w && dim.w < resize.w) {
            dim.w = resize.w;
            dim.h = dim.w / ratio;
          }
          if (resize.h && dim.h < resize.h) {
            dim.h = resize.h;
            dim.w = dim.h * ratio;
          }
          let canvas = document.createElement("canvas");
          canvas.width = dim.w;
          canvas.height = dim.h;
          canvas.getContext("2d").drawImage(img, 0, 0, dim.w, dim.h);
          str = canvas.toDataURL("image/jpeg").replace(/^.+?,/, "");
        }
        let chars = atob(str);
        let bytes = new Array(chars.length);
        for (let i = 0; i < bytes.length; i++) bytes[i] = chars.charCodeAt(i);
        let byteArray = new Uint8Array(bytes);
        let blob = new Blob([byteArray], { type: "image/jpeg" });
        let fileOptions = { type: blob.type, size: blob.size };
        let name =
          `${getDataTransfer.rndStr}_` + getDataTransfer.counter++ + ".jpg";
        transfer.items.add(new File([blob], name, fileOptions));
      }
      resolve(transfer.files);
    });
  });
};

jQuery.fn.dispatch = function (event, obj) {
  try {
    if (this[0] === undefined)
      throw new Error("cant dispatch, object is empty");
    if (this.length > 1) throw new Error("More that one selected node");
  } catch (error) {
    er(error);
    return this;
  }
  if (obj === undefined) obj = {};
  if (obj.bubbles === undefined) obj.bubbles = true;
  if (obj.cancelable === undefined) obj.cancelable = true;
  if (obj.composed === undefined) obj.composed = false;
  let evt;
  if (["keypress", "keyup", "keydown"].indexOf(event) > -1)
    evt = new KeyboardEvent(event, obj);
  else evt = new Event(event, obj);
  this[0].dispatchEvent(evt);
  return this;
};
