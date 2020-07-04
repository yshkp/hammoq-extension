var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "list"){
       console.log(msg);
       closet();
       port.postMessage({poshmarkanswer1: "listingposhmark"})
    }

  });

function closet(){
  setTimeout(() => {
    const purl = document.getElementsByClassName('title')[6].href
    console.log(purl);
    setTimeout(async () => {
      chrome.storage.sync.get("data", async (value) => {
        
        const token = value.data.token
          fetch(`http://localhost:8000/api/client/product/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:purl, name:"poshmark"}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
          
      })
    },2000);
  }, 1500);
}

