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

jQuery.fn.dispatch = function (event, obj) {
  try {
    if (this[0] === undefined)
      throw new Error("cant dispatch, object is empty");
    if (this.length > 1) throw new Error("More that one selected node");
  } catch (error) {
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
