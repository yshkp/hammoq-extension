
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "delist"){
       console.log(msg);
       delist2();
       port.postMessage({poshmarkanswer1: "delistingmercari"})
    }

  });

  
function delist2(){
setTimeout(async () => {
    document.getElementsByClassName("Button-y431fn-0 Button-sc-28019x-3 ItemActions__ActionButton-tajqnq-0 dJtvHp")[0]//0-->deactivate,1-->delete
    .click();
  },4000)
}