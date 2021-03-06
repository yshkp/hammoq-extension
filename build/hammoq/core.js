let data;

if (document.domain == "app.hammoq.com" || document.domain == "localhost") {
  var port = chrome.runtime.connect({name: "app"});
  port.postMessage({platform: "hammoq"});
  port.onMessage.addListener(function(msg) {
    if (msg.q1 == "action"){
      console.log(msg);
      port.postMessage({answer1: "list"});
    }
  });


  setTimeout(() => {
    let images = document.getElementsByTagName("img");
    let paths = [];
    for (let i = 1; i < images.length; i++) {
      paths.push(images[i].currentSrc.split("assets/")[1]);
    }

    // chrome.runtime.onConnect.addListener(function(port) {
    //   console.assert(port.name == "knockknock");
    //   port.onMessage.addListener(function(msg) {
    //     if (msg.joke == "Knock knock"){
    //       console.log(msg);
    //       port.postMessage({question: "Who's there?"});
    //     }
    //     else if (msg.answer == "Madame"){
    //       port.postMessage({question: "Madame who?"});
    //     }
    //     else if (msg.answer == "Madame... Bovary"){
    //       port.postMessage({question: "I don't get it."});
    //     }
    //   });
    // });

    data = {
      mrp: document.getElementById("mrp").value,
      brand: document.getElementById("brand").value,
      colorShade: document.getElementById("colorShade").value,
      material: document.getElementById("material").value,
      size: document.getElementById("size").value,
      title: document.getElementById("tite").value,
      style: document.getElementById("style").value,
      pattern: document.getElementById("pattern").value,
      seasonOrWeather: document.getElementById("seasonOrWeather").value,
      care: document.getElementById("care").value,
      madeIn: document.getElementById("madeIn").value,
      waist: document.getElementById("waist").value,
      inseam: document.getElementById("inseam").value,
      rise: document.getElementById("rise").value,
      bottomDescription: document.getElementById("bottomDescription").value,
      price: document.getElementById("price").value,
      msrp: document.getElementById("msrp").value,
      sku: document.getElementById("sku").value,
      upc: document.getElementById("upc").value,
      quantity: document.getElementById("quantity").value,
      shortDescription: document.getElementById("shortDescription").value,
      model: document.getElementById("model").value,
      line1: document.getElementById("line1").value,
      line2: document.getElementById("line2").value,
      line3: document.getElementById("line3").value,
      line4: document.getElementById("line4").value,
      line5: document.getElementById("line5").value,
      condition: document.getElementById("condition_name").value,
      keywords: document.getElementById("keywords").value,
      note: document.getElementById("note").value,
      weightLB: document.getElementById("weightLB").value,
      weightOZ: document.getElementById("weightOZ").value,
      zipCode: document.getElementById("zipCode").value,
      packageLength: document.getElementById("packageLength").value,
      packageWidth: document.getElementById("packageWidth").value,
      packageHeight: document.getElementById("packageHeight").value,
      costOfGoods: document.getElementById("costOfGoods").value,
      shippingFees: document.getElementById("shippingFees").value,
      profit: document.getElementById("profit").value,
      paths: paths,
      productid: window.location.href.substring(window.location.href.lastIndexOf('/')+1),
      token: localStorage.getItem("token")
    };
    chrome.storage.sync.set({ data: data }, () => {
      chrome.storage.sync.get("data", (value) => {
        console.log(value.data);
      });
    });
  }, 1000);
}