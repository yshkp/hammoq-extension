let data;

if (
  document.domain !== "poshmark.com" &&
  document.domain !== "bulksell.ebay.com"
) {
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
    };
    chrome.storage.sync.set({ data: data }, () => {
      chrome.storage.sync.get("data", (value) => {
        console.log(value.data);
      });
    });
  }, 1000);
}

if (document.domain == "poshmark.com") {
  setTimeout(() => {
    chrome.storage.sync.get("data", async (value) => {
      fetch("https://app.hammoq.com/images", {
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
          }
          let firstImg = $(
            ".listing-editor__image .listing-editor__edit-overlay"
          );
          console.log(firstImg);
          if (firstImg.length > 0) {
            console.log("if", firstImg);
            firstImg.click();
            let form = await waitForNode(
              ".listing-editor__modal-image, .image-edit-modal"
            );
            let input = form.find('input[type="file"]')[0];
            input.files = transfer.files;
          }
          let input = $('[type="file"]')[0];
          input.files = transfer.files;
          $(input).dispatch("change");
          let imageForm = await waitForNode(
            ".image-edit-modal, .listing-editor__modal-image",
            5
          );
          let submitButton = await waitForNode(
            " .btn.btn--primary",
            5,
            imageForm
          );
          if (submitButton) {
            let previews = $(".listing-editor__covershot-thumb img");
            for (let i = 0; i < previews.length; i++) {
              let preview = previews.eq(i);
              while (!preview[0].complete) await wait(50);
            }
            await wait(500);
            submitButton.dispatch("click");
          }
        });
      setTimeout(async () => {
        $('[placeholder="What are you selling? (required)"]')
          .val(value.data.title)
          .dispatch("input");
        $('[placeholder="Describe it! (required)"]')
          .val(value.data.shortDescription)
          .dispatch("input");
        $('[placeholder="Enter the Brand/Designer"]')
          .val(value.data.brand)
          .dispatch("input");
        let select = $('.dropdown__selector [data-et-name="color"]').parent();
        select.dispatch("click");
        let list = await waitForNode(".dropdown__menu", 999, select.parent());
        let colors = list.find("li");
        for (let i = 0; i < colors.length; i++) {
          let li = colors.eq(i);
          let color = li.text().replace(/\s+/g, "").toLowerCase();
          if (color === value.data.colorShade.toLowerCase())
            li.dispatch("click");
        }
        list.find("button").dispatch("click");
        await waitForNode('[data-vv-name="originalPrice"]');
        $('[data-vv-name="originalPrice"]')
          .val(Math.round(value.data.msrp.replace("$", "")))
          .dispatch("input");
        await waitForNode('[data-vv-name="sku"]');
        $('[data-vv-name="sku"]').val(value.data.sku).dispatch("input");
        $('[data-vv-name="listingPrice"]')
          .val(Math.round(value.data.price.replace("$", "")))
          .dispatch("input");
        let condButtons = $('h4:contains("Does this item have tags attached?")')
          .parent()
          .find("button");
        if (value.data.condition == "New with tags")
          condButtons.eq(0).dispatch("click");
        else condButtons.eq(1).dispatch("click");
      }, 2000);
    });
  }, 1500);
}

if (document.domain == "bulksell.ebay.com") {
  setTimeout(() => {
    chrome.storage.sync.get("data", async (value) => {
      fetch("https://app.hammoq.com/images", {
        method: "POST",
        body: JSON.stringify(
          value.data.paths.length > 10
            ? value.data.paths.splice(10)
            : value.data.paths
        ),
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
          }
        });
      setTimeout(async () => {
        (await waitForNode(".find-product"))
          .val(value.data.title)
          .dispatch("input");
        (
          await waitForNode(
            "#w0-find-product-search-bar-search-button:not(:disabled)"
          )
        ).click();
        let button = await waitForNode(".continue-without-product .btn");
        button.dispatch("click");
      }, 2000);
    });
  }, 1500);
}
