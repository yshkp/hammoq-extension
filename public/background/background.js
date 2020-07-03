chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "app");
  port.onMessage.addListener(async function(msg) {
    
    if (msg.platform == "hammoq"){
    	console.log(msg);
      port.postMessage({q1: "action"});
    }
    else if (msg.answer1 == "list"){
       console.log(msg)
       localStorage.setItem("action", msg.answer1);
      //await window.open("https://www.facebook.com/marketplace/")
    }else if(msg.poshmarkintro == "helloposhmark"){
       console.log(localStorage.getItem("action"))
       port.postMessage({actionposhmark: localStorage.getItem("action")});
    }else if (msg.poshmarkanswer1 == "listingposhmark"){
      console.log(msg)
      localStorage.removeItem("action");
    }

  });
});