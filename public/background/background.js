chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "app");
  port.onMessage.addListener( function(msg) {
    //hammoq
    if (msg.answer1 == "list"){
       console.log(msg)
       localStorage.setItem("action", msg.answer1);
    }else if (msg.answer1 == "delist"){
       console.log(msg)
       localStorage.setItem("action", msg.answer1);
    }
    //poshmark
    else if(msg.poshmarkintro == "helloposhmark"){
       console.log(localStorage.getItem("action"))
       port.postMessage({actionposhmark: localStorage.getItem("action")});
    }else if (msg.poshmarkanswer1 == "listingposhmark"){
      console.log(msg)
      localStorage.removeItem("action");
    }else if (msg.poshmarkanswer1 == "delistingposhmark"){
      console.log(msg)
      localStorage.removeItem("action");
    }
    //mercari
    else if(msg.poshmarkintro == "hellomercari"){
       console.log(localStorage.getItem("action"))
       port.postMessage({actionposhmark: localStorage.getItem("action")});
    }else if (msg.poshmarkanswer1 == "listingmercari"){
      console.log(msg)
      localStorage.removeItem("action");
    }else if (msg.poshmarkanswer1 == "delistingmercari"){
      console.log(msg)
      localStorage.removeItem("action");
    }

  });
});