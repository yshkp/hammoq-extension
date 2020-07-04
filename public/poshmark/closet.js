

if (document.domain == "poshmark.com") {
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

