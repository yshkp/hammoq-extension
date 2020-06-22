let lessFile;
window.addButtonsPreprocess = async function (less) {
  if (!less) less = SHOP;
  lessFile = less;
  window.isLogged = await isLoggedIn();
  if (window.isLogged) {
    window.foreignIds = await getForeignSourcesByShop(SHOP);
    window.userRole = await getUserRole();
    if (window.userRole === false) window.isLogged = false;
  } else window.userRole = false;
  $(".LPE_Button").remove();
};

let isSelecting = false;
let selectedHrefs = [];

let addButtonsInProcess = false;
window.addButtons_common = async function (
  items,
  fn_getItemMisc,
  fn_copyButtonContainer,
  bulkButtonContainer,
  fn_redirectToItem
) {
  if (addButtonsInProcess) return;
  addButtonsInProcess = true;
  await getExtensionLess(`css/${lessFile}.less`);
  let requestLogin = !isLogged || userRole === "Subscriber";
  if (!requestLogin) addCopyFromToDiv().then();
  else $(`#LPE_CopyFromTo`).remove();
  let maxCopiesReached = !requestLogin && !(await isUserCanCopy(userRole));
  for (let item of items) {
    item = $(item);
    if (item.find(".LPE_Button").length > 0) continue;
    let itemMisc = await fn_getItemMisc(item);
    if (selectedHrefs.indexOf(itemMisc.href) > -1)
      item.addClass("LPE_bulkSelectChecked");
    $('<button class="LPE_Button copyFromTo"/>')
      .appendTo(fn_copyButtonContainer(item))
      .toggleClass("requestLogin", requestLogin)
      .toggleClass("hidden", isSelecting)
      .toggleClass("maxCopiesReached", maxCopiesReached)
      .prop("disabled", maxCopiesReached)
      .click(async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if ($(event.target).hasClass("requestLogin")) return refreshLogin();
        if ($(event.target).hasClass("maxCopiesReached")) return;
        $(`#LPE_CopyFromTo`)
          .attr("data-href", JSON.stringify([itemMisc.href]))
          .addClass("visible")
          .find("h1 b")
          .text(1)
          .end()
          .find("h1 span")
          .removeClass("multiple");
      });
    if (maxCopiesReached || !isLogged) continue;
    let copiedToLP = foreignIds.indexOf(itemMisc.id) > -1;
    $('<div class="LPE_Div copiedToLP"></div>')
      .appendTo(fn_copyButtonContainer(item))
      .toggleClass("true", copiedToLP);
  }
  let LPE_startBulk_button = $("#LPE_startBulk_button");
  addButtonsInProcess = false;
  if (isLogged && userRole === "Simple") {
    LPE_startBulk_button.remove();
    return;
  }
  let itemClickListener = async function (event) {
    if (!isSelecting) return true;
    event.stopImmediatePropagation();
    let href = (await fn_getItemMisc($(this))).href;
    if ($(this).hasClass("LPE_bulkSelectChecked")) {
      let i = selectedHrefs.indexOf(href);
      selectedHrefs.splice(i, 1);
    } else selectedHrefs.push(href);
    $(this).toggleClass("LPE_bulkSelectChecked");
  };
  let itemClickCanceler = function (event) {
    if (!isSelecting) return true;
    event.stopImmediatePropagation();
    event.preventDefault();
    fn_redirectToItem($(this)).click();
  };
  items.bind("click", itemClickListener);
  items.find("*").bind("click", itemClickCanceler);
  if (LPE_startBulk_button.length) return;
  $('<button class="LPE_Button" id="LPE_startBulk_button">')
    .toggleClass("requestLogin", requestLogin)
    .prependTo(bulkButtonContainer)
    .click((event) => {
      event.stopImmediatePropagation();
      if ($(event.target).hasClass("requestLogin")) refreshLogin();
      else if (!$(event.target).hasClass("active")) {
        $(event.target).addClass("active");
        isSelecting = true;
        $(".LPE_Button.copyFromTo, .LPE_Button.copyToLP:not(.copied)").addClass(
          "hidden"
        );
      } else {
        $(event.target).removeClass("active");
        isSelecting = false;
        $(".LPE_Button.hidden").removeClass("hidden");
        $(".LPE_bulkSelectChecked").removeClass("LPE_bulkSelectChecked");
        if (selectedHrefs.length > 0)
          $(`#LPE_CopyFromTo`)
            .attr("data-href", JSON.stringify(selectedHrefs))
            .addClass("visible")
            .find("h1 b")
            .text(selectedHrefs.length)
            .end()
            .find("h1 span")
            .toggleClass("multiple", selectedHrefs.length > 1);
        selectedHrefs = [];
      }
    });
};

window.addCopyFromToDiv = async function () {
  if ($(`#LPE_CopyFromTo`).length > 0) return;
  return new Promise((resolve) => {
    Promise.all([
      getExtensionSource("html/copyFromToDiv.html"),
      getExtensionLess("css/copyFromToDiv.less"),
    ]).then((data) => {
      let div = $(data[0].toString());
      div.css({ visibility: "hidden", "animation-duration": "0" });
      $(document.body).append(div);
      setTimeout(() => {
        div.removeAttr("style");
      }, 1000);
      div.click(() => {
        div.find(".errorDiv").removeClass("visible");
        div.removeClass("visible");
      });
      let buttons = div.find(".buttons");
      for (let shop of Object.keys(shops))
        $(`<button class="shop"></button>`)
          .attr({ "data-shop": shop, "data-name": shops[shop].name })
          .click(async (event) => {
            event.stopPropagation();
            //if (userRole.indexOf('Simple') > -1) buttons.find('.checked').removeClass('checked');
            $(event.target).toggleClass("checked");
          })
          .appendTo(buttons);
      div.find(".proceed").click(async (event) => {
        event.stopPropagation();
        let shops = [];
        for (let shop of div.find(".shop.checked"))
          shops.push($(shop).attr("data-shop"));
        if (shops.length === 0) return;
        $(event.target).prop("disabled", true);
        let hrefs = JSON.parse(div.attr("data-href"));
        let copyLeft = await getCopyCounterLeft(userRole);
        let copyTrying = shops.length * hrefs.length;
        if (copyLeft !== null && copyLeft < copyTrying) {
          div
            .find(".errorDiv")
            .text(
              `Trying to copy too much items. Tried ${copyTrying}, but can only ${copyLeft}`
            )
            .addClass("visible");
        } else {
          let result = await copyFromTo(shops, hrefs);
          if (!result)
            div
              .find(".errorDiv")
              .text("Please log in or subscribe")
              .addClass("visible");
          else if (result === MAX_COPIES_REACHED_TAG)
            div
              .find(".errorDiv")
              .text("Max copies count is reached")
              .addClass("visible");
        }
        $(event.target).prop("disabled", false);
      });
      div.find(".help").click((event) => {
        event.stopImmediatePropagation();
      });
      resolve(div);
    });
  });
};

let lessLoaded = [],
  lessConf;
window.getExtensionLess = async function (url) {
  if (!lessLoaded) getExtensionLess.loaded = [];
  if (lessLoaded.indexOf(url) > -1) return;
  else lessLoaded.push(url);
  if (typeof lessConf === "undefined") {
    lessConf = (await import("/js/lib/less_conf_export.js")).lessConf;
    window.less = lessConf;
    await import("/js/lib/less.min.js");
    getExtensionLess("css/_common.less").then();
  }
  less
    .render(await getExtensionSource(url), lessConf)
    .then((css) => $(document.body).append($(`<style>${css.css}</style>`)));
  return true;
};

window.getExtensionSource = async function (url) {
  return await new Promise((resolve) => {
    $.ajax({
      url: chrome.extension.getURL(url),
      success: (data) => resolve(data),
    });
  });
};
