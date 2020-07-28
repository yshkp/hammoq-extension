var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "listposhmark"){
       console.log(msg);
       closet();
       port.postMessage({poshmarkanswer1: "listingposhmark"})
    }

  });

function closet(){
  setTimeout(() => {
    const purl = document.getElementsByClassName('tile__title tc--b')[0].href
    console.log(purl);
    setTimeout(async () => {
      chrome.storage.sync.get("data", async (value) => {
        
        const token = value.data.token
        if(token == null){
          fetch(`https://app.hammoq.com/images/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:purl, name:"poshmark", clientid:value.data.clientid, domain:value.data.domain}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
        }else{
          fetch(`https://app.hammoq.com/api/client/product/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:purl, name:"poshmark", clientid:value.data.clientid, domain:value.data.domain}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
        } 
      })
    },2000);
  }, 1500);
}

