
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "hellomercari"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionmercari == "delist"){
       console.log(msg);
       delist();
    }

  });

function delist(){
  console.log("delisting")
setTimeout(async () => {
  document.getElementsByClassName("Text__LinkText-sc-1e98qiv-0-a Link__StyledAnchor-dkjuk2-0 fiIUU Link__StyledPlainLink-dkjuk2-2 eehIGL Button-sc-28019x-3-Component ButtonLink-sc-1efpvhs-2 kUKITA")[0]
  .click();//edit button
},4000);
}