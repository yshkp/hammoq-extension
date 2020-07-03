
if (document.domain == "poshmark.com") {
  setTimeout(() => {
    // var port = chrome.runtime.connect({name: "knockknock"});
    // port.postMessage({joke: "Knock knock"});
    // port.onMessage.addListener(function(msg) {
    //   if (msg.question == "Who's there?"){
    //     console.log(msg.question);
    //     port.postMessage({answer: "Madame"});
    //   }
    //   else if (msg.question == "Madame who?")
    //     port.postMessage({answer: "Madame... Bovary"});
    // });



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

      setTimeout(async () => {
        $('[data-et-name="next"]').dispatch("click");
      },20000);

      
      setTimeout(async () => {
         $('[data-et-name="list_item"]').dispatch("click");
      },25000);

      
       
      
        
    });
  }, 1500);

}