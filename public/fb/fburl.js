var port = chrome.runtime.connect({name: "app"});
  port.postMessage({fbintro: "hellofb"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionfb == "listfb"){
       console.log(msg);
       fburl();
       port.postMessage({fbanswer1: "listingfb"})
    }

  })
function fburl() {
  console.log("fb url")
	setTimeout(async () => {
    await document.getElementsByClassName("_3qn7 _61-0 _2fyi _3qnf")[1].click()//latest(0) div click to open item page
		await setTimeout(async() => {
		  const fburl = window.location.href
			console.log(fburl)
		},2000)
		    
    await chrome.storage.sync.get("data", async (value) => {
    const token = value.data.token
      fetch(`http://localhost:8000/api/client/product/url/${value.data.productid}`, {
        method: "PUT",
        body: JSON.stringify({url: window.location.href, name:"facebook"}),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
    })
        
	},2000)	
}