url()



function url(){
setTimeout(async () => {
  console.log(window.location.href)
  chrome.storage.sync.get("data", async (value) => {
          const token = value.data.token
          fetch(`http://localhost:8000/api/client/product/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:window.location.href, name:"mercari"}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
  });
},4000);
}


