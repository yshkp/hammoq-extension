console.log("ebay delist")
var port = chrome.runtime.connect({name: "app"});
  port.postMessage({ebayintro: "helloebay"});
  port.onMessage.addListener(function(msg) {

    if (msg.actionebay == "delistebay"){
       console.log(msg);
       console.log(msg.ebaydelisturl);
       ebaydelist(msg.ebaydelisturl);
       //port.postMessage({ebayanswer1: "delistingebay"});
    }

  });
function ebaydelist(url){
	setTimeout(() => {
		setTimeout(() => {
				var len = document.getElementsByTagName("a").length;
				console.log(len)
				for(let i=0;i<len;i++){//m0-0-4-16-45-gridData-gridContent-grid-grid-row-203043540349-16[2]-1[0]
					console.log(i);
					if(document.getElementsByTagName("a")[i].href[7] == url[8]){
						console.log(document.getElementsByTagName("a")[i].href)
						var f = "s0-0-4-16-45-gridData-gridContent-grid-grid-row-"+url.substring(url.lastIndexOf("/")+1)+"-grid-menu"
						document.getElementById(f).children[1].click()//button
						setTimeout(() => {
							document.getElementsByClassName("fake-menu__item")[3].click()
						},2000)
					}
				}
		},2000)

		

	},2000)
}