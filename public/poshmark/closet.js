let data;

if (document.domain == "app.hammoq.com" || document.domain == "localhost") {
  setTimeout(() => {
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
  setTimeout(() => {
    chrome.storage.sync.get("data", async (value) => {
      fetch("http://localhost:8000/images", {
        method: "POST",
        body: JSON.stringify(value.data.paths),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(async (res) => {
          console.log(res);
          let transfer = new DataTransfer();
          for (let base64String of res) {
            let img = new Image();
            img.src = "data:image/jpeg;base64," + base64String;
            let dim = await new Promise(
              (resolve) =>
                (img.onload = () =>
                  resolve({
                    w: img.width,
                    h: img.height,
                  }))
            );
            let canvas = document.createElement("canvas");
            canvas.width = dim.w;
            canvas.height = dim.h;
            canvas.getContext("2d").drawImage(img, 0, 0, dim.w, dim.h);
            base64String = canvas.toDataURL("image/jpeg").replace(/^.+?,/, "");
            let chars = atob(base64String);
            let bytes = new Array(chars.length);
            for (let i = 0; i < bytes.length; i++)
              bytes[i] = chars.charCodeAt(i);
            let byteArray = new Uint8Array(bytes);
            let blob = new Blob([byteArray], { type: "image/jpeg" });
            let fileOptions = { type: blob.type, size: blob.size };
            let name = Math.floor(Math.random() * 100 + 1) + ".jpg";
            transfer.items.add(new File([blob], name, fileOptions));
            let imag;
            while ((imag = $('img[alt="thumbnail"]')).length > 0) {
              imag
                .eq(0)
                .parent()
                .find('div:contains("DELETE")')
                .last()
                .dispatch("click");
              await waitForNodeDisappear(imag);
            }
            await waitForNode('[type="file"]');
            let input = $('[type="file"]')[0];
            input.files = transfer.files;
            $(input).dispatch("change");
          }
        });
      setTimeout(async () => {
        (await waitForNode('[placeholder="What are you selling?"]'))
          .dispatch("focus")
          .val(value.data.title.substr(0, 40))
          .dispatch("input")
          .dispatch("blur");
        $('[placeholder="Describe your item"]')
          .dispatch("focus")
          .val(value.data.shortDescription)
          .dispatch("input")
          .dispatch("blur");
        let condStr = value.data.condition.toLowerCase();
        let condVals = $('[name="sellCondition"]');
        let valDiv;
        if (condStr.indexOf("new with tags") > -1 || /new/i.test(condStr))
          valDiv = condVals.eq(0);
        else if (condStr.indexOf("new without tags") > -1)
          valDiv = condVals.eq(1);
        if (valDiv) valDiv.prop("checked", true).dispatch("click");
        let input = $('[placeholder="Select brand"]');
        if (input.length) {
          let brand = value.data.brand.toLowerCase().trim();
          input.val(value.data.brand).dispatch("input");
          let divs = input.parent().find(">div").find("[id]");
          let gotSuggestion = false;
          if (divs.length) {
            for (let div of divs) {
              if ($(div).text().toLowerCase() === brand) {
                $(div).dispatch("click");
                gotSuggestion = true;
                break;
              }
            }
          }
          if (!gotSuggestion) e("No brand suggestion, cant set it");
        } else e("No brand input, cant set it");
        $('[placeholder="Input Zip code"]')
          .dispatch("focus")
          .dispatch("focus")
          .val(value.data.zipCode)
          .dispatch("input")
          .dispatch("blur");
        $('[placeholder="(min.$5/max.$2,000)"]')
          .dispatch("focus")
          .val(parseInt(value.data.price.replace(/[^\d.]/, "")))
          .dispatch("input")
          .dispatch("blur");
      }, 2000);

      setTimeout(async () => {
       // await waitForNode(".Button__PrimaryButton-xht50r-0 Button__SecondaryButton-xht50r-1 bWXZIN")
       //    .dispatch("click")
       document.getElementsByTagName('button')[7].click();
       setTimeout(async () => {
          
            const token = value.data.token
            fetch(`http://localhost:8000/api/client/product/url/${value.data.productid}`, {
              method: "PUT",
              body: JSON.stringify({url:purl, name:"mercari"}),
              headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
              },
            })
          
        },10000);
          
      },20000);
    });
  }, 1500);
}

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

