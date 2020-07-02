let data;

if (document.domain == "app.hammoq.com" || document.domain == "localhost") {
  setTimeout(() => {
    console.log("delist ext")
    let images = document.getElementsByTagName("img");
    let paths = [];
    for (let i = 1; i < images.length; i++) {
      paths.push(images[i].currentSrc.split("assets/")[1]);
    }
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

if (document.domain == "www.mercari.com") {

}

if (document.domain == "poshmark.com") {
  setTimeout(() => {
    setTimeout(() => {
              document.getElementsByClassName('td--ul tc--lg')[0].click()//delete item button
      },2500);

     setTimeout(() => {
                document.getElementsByClassName('btn btn--primary')[11].click()//yes confirm button
      },2500);

     console.log("delisted done")
  },2500);
}

