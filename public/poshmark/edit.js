
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "delist"){
       console.log(msg);
       deletedata();
    }

  });

function deletedata(){
if (document.domain == "poshmark.com") {
  setTimeout(() => {
    document.getElementsByClassName('btn btn--tertiary btn--icon')[0].click()//edit listing
  },2500);

}
}

