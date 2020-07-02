chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "app");
  port.onMessage.addListener(async function(msg) {
    if (msg.platform == "hammoq"){
    	console.log(msg);
      port.postMessage({q1: "action"});
    }
    else if (msg.answer1 == "list"){
      await console.log(msg)
      await localStorage.setItem("action", msg.answer1);
      await window.open("https://www.facebook.com/marketplace/")
    }
    else if (msg.fbanswer1 == "listingfb"){
      console.log(msg)
      localStorage.removeItem("action");
    }else if(msg.fbintro == "hellofb"){
      await console.log(localStorage.getItem("action"))
      await port.postMessage({actionfb: localStorage.getItem("action")});
    }
  });
});