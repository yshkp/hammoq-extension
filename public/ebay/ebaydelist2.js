console.log("ebay delist2")
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({ebayintro: "helloebay"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionebay == "delistebay"){
       console.log(msg);
       ebaydelist2();
       port.postMessage({ebayanswer1: "delistingebay"});
    }

  });

function ebaydelist2(){
setTimeout( () => {
	//(await waitForNode('input[value="2"]')).prop('checked', true).dispatch('click');
	 document.getElementsByTagName("input")[9].checked=true;

	 chrome.storage.sync.get("data", async (value) => {
	        
	        const token = value.data.token
	        if(token == null){
	        	fetch(`https://app.hammoq.com/images/url/${value.data.productid}`, {
	            method: "PUT",
	            body: JSON.stringify({url:"", name:"ebay", type:"delist", clientid:value.data.clientid, domain:value.data.domain}),
	            headers: {
	              "Content-Type": "application/json",
	              "x-access-token": token,
	            },
	          })
	        }else{
	        	fetch(`https://app.hammoq.com/api/client/product/url/${value.data.productid}`, {
	            method: "PUT",
	            body: JSON.stringify({url:"", name:"ebay", type:"delist", clientid:value.data.clientid, domain:value.data.domain}),
	            headers: {
	              "Content-Type": "application/json",
	              "x-access-token": token,
	            },
	          })
	        }
	          
	      })
	      console.log("delisted from db done")

	      
	 document.getElementsByTagName("input")[13].click();

},2000);
}