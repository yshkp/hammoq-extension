
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "delist"){
       console.log(msg);
       deletess()
       port.postMessage({poshmarkanswer1: "delistingposhmark"})
    }

  });


function deletess(){
  setTimeout(() => {
    setTimeout(() => {
              document.getElementsByClassName('td--ul tc--lg')[0].click()//delete item button
      },2500);

     setTimeout(() => {
                document.getElementsByClassName('btn btn--primary')[11].click()//yes confirm button
      },2500);

     console.log("delisted done")
     //localStorage.setItem("assert",false)
  },2500);
}

