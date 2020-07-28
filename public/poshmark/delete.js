var port = chrome.runtime.connect({name: "app"});
  port.postMessage({poshmarkintro: "helloposhmark"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionposhmark == "delistposhmark"){
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

    setTimeout(async () => {
      chrome.storage.sync.get("data", async (value) => {
        
        const token = value.data.token
          if(token == null){
            fetch(`https://app.hammoq.com/images/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:"", name:"poshmark", type:"delist", clientid:value.data.clientid, domain:value.data.domain}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
          }else{
            fetch(`https://app.hammoq.com/api/client/product/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:"", name:"poshmark", type:"delist", clientid:value.data.clientid, domain:value.data.domain}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
          }
      })
      console.log("delisted from db done")
    },1000);

    setTimeout(() => {
                document.getElementsByClassName('btn btn--primary')[11].click()//yes confirm button
      },2500);

     console.log("delisted done")
     //localStorage.setItem("assert",false)


  },2500);
}

