
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "delist"){
       console.log(msg);
       delist();
       port.postMessage({poshmarkanswer1: "delistingmercari"})
    }

  });

function delist(){
setTimeout(async () => {
  document.getElementByClassName("Text__LinkText-sc-1e98qiv-0-a Link__StyledAnchor-dkjuk2-0 fiIUU Link__StyledPlainLink-dkjuk2-2 eehIGL Button-sc-28019x-3-Component ButtonLink-sc-1efpvhs-2 kUKITA")[0]
  .click();
  setTimeout(async () => {
    document.getElementByClassName("Button-y431fn-0 Button-sc-28019x-3 ItemActions__ActionButton-tajqnq-0 dJtvHp")[0]//0-->deactivate,1-->delete
    .click();
  },4000)
},4000);
}