const COPY_OPERATIONS_MAX = 100;
const COPY_OPERATIONS_NAME = 'copyCounter';
Object.defineProperty(window, "MAX_COPIES_REACHED_TAG", {
  value: "MAX_COPIES_REACHED_TAG",
  writable: false,
  enumerable: true,
  configurable: true
});
async function getCopyCounter() {
  let debug = await getDebug('copied');
  if (debug !== 'undefined') return parseInt(debug);
  let val = await load(COPY_OPERATIONS_NAME);
  if (typeof val === 'undefined') val = 0;
  if (typeof val !== 'number') val = parseInt(val);
  if (isNaN(val)) throw new Error('getCopyCounter - got NaN value');
  return val;
}

window.riseCopyCounter = async function() {
  let val = await getCopyCounter();
  let obj = {};
  obj[COPY_OPERATIONS_NAME] = val + 1;
  await save(obj);
  if (!await isUserCanCopy()) reloadCopyButtons().then();
};

window.isUserCanCopy = async function(role) {
  if (role === undefined) role = await getUserRole();
  if (role === false) return false;
  else if (role === 'Simple25') {
    let val = await getCopyCounter();
    return val < COPY_OPERATIONS_MAX;
  }
  else return true;
};
window.resetCopyCounter = async function() {
  let obj = {};
  obj[COPY_OPERATIONS_NAME] = 0;
  await save(obj);
};

window.getCopyCounterLeft = async function(role) {
  if (!role) role = await getUserRole();
  if (role === 'Simple25') {
    let val = COPY_OPERATIONS_MAX - await getCopyCounter();
    return val >= 0 ? val : 0 ;
  }
  else return null;
};