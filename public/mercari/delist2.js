
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({mercariintro: "hellomercari"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionmercari == "delistmercari"){
       console.log(msg);
       delist2();
       port.postMessage({mercarianswer1: "delistingmercari"})
    }

  });

  
function delist2(){
setTimeout(async () => {
      chrome.storage.sync.get("data", async (value) => {
        
        const token = value.data.token
        if(token == null){
          fetch(`https://app.hammoq.com/images/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:"", name:"mercari", type:"delist",clientid:value.data.clientid, domain:value.data.domain}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
        }else{
          fetch(`https://app.hammoq.com/api/client/product/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:"", name:"mercari", type:"delist",clientid:value.data.clientid, domain:value.data.domain}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
        }
          
      })
      console.log("delisted from db done")
},1000);

setTimeout(async () => {
    document.getElementsByClassName("Button-y431fn-0 Button-sc-28019x-3 ItemActions__ActionButton-tajqnq-0 dJtvHp")[0]//0-->deactivate,1-->delete
    .click();
},10000)
}