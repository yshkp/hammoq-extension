console.log("ebay");
var port = chrome.runtime.connect({ name: "app" });
port.postMessage({ ebayintro: "helloebay" });
port.onMessage.addListener(function (msg) {
  if (msg.actionebay == "listebay") {
    console.log(msg);
    ebayset();
  }
});

function ebayset() {
  setTimeout(async () => {
    chrome.storage.sync.get("data", async (value) => {
      console.log(value.data);
      if (document.getElementsByClassName("find-product").length > 0) {
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
      }

      //color & brand
      setTimeout(() => {
        $('iframe[id*="txtEdit_st"]')
          .contents()
          .find("body")
          .html(value.data.shortDescription.replace(/\n/g, "<br/>"));
        setTimeout(() => {
          document.getElementById("Listing.Item.ItemSpecific[Color]").value =
            value.data.colorShade;
          document.getElementById("Listing.Item.ItemSpecific[Brand]").value =
            value.data.brand;
        }, 5000);

        let inputs = $('input[type="text"][id*=Listing]');
        let sizeType = $('[id*="Listing"][id*="[Size Type]"]').filter(
          "input, select"
        );
        if (sizeType.length) {
          sizeType
            .val("Regular")
            .dispatch("keyup", { keyCode: 50 })
            .dispatch("change")
            .dispatch("blur");
          wait(50);
          $("body").dispatch("click");
          waitForNode('div[id*="[Size"][id*="menu"] li', 2);
        }
        let inputSize = $('input[id*="[Size"]:not([id*="[Size Type]"])');
        if (inputSize.length) {
          if (inputSize.length > 1) inputSize = inputSize.eq(1);
          if (/^xx/.test(value.data.size.toLowerCase())) {
            let count = value.data.size.toLowerCase().match(/x/g).length;
            value.data.size =
              "" +
              count +
              "X" +
              value.data.size.toUpperCase().replace(/X/g, "");
          }
          inputSize.val(value.data.size).dispatch("keyup", { keyCode: 50 });
        }
        if (inputs.filter('[id*="Style"]').length)
          inputs
            .filter('[id*="Style"]')
            .val(value.data.style)
            .dispatch("keyup", { keyCode: 50 });
        inputs
          .filter('[id*="Pattern"]')
          .val(value.data.pattern)
          .dispatch("keyup", { keyCode: 50 });
        inputs
          .filter('[id*="Material"]')
          .val(value.data.material)
          .dispatch("keyup", { keyCode: 50 });
        wait(50);
        $(document.body).dispatch("click");
        $("#binPrice").val(value.data.price).dispatch("keyup", { keyCode: 50 });
        $("#editpane_skuNumber")
          .val(value.data.sku)
          .dispatch("keyup", { keyCode: 50 });
        let condInput = $("#itemCondition");
        switch (value.data.condition.toLowerCase()) {
          default:
          case "new":
          case "new with tags":
            condInput.val(1000);
            break;
          case "new without tags":
            condInput.val(1500);
            break;
        }
        condInput.dispatch("change");
        $("#upc").val(value.data.upc).dispatch("keyup", { keyCode: 50 });
        $("#pkgLength")
          .val(value.data.packageLength)
          .dispatch("keyup", { keyCode: 50 });
        $("#pkgWidth")
          .val(value.data.packageWidth)
          .dispatch("keyup", { keyCode: 50 });
        $("#pkgHeight")
          .val(value.data.packageHeight)
          .dispatch("keyup", { keyCode: 50 });
        $("#majorUnitWeight")
          .val(value.data.weightLB)
          .dispatch("keyup", { keyCode: 50 });
        $("#minorUnitWeight")
          .val(value.data.weightOZ)
          .dispatch("keyup", { keyCode: 50 });
        $("#itemPostalCode")
          .val(value.data.zipCode)
          .dispatch("keyup", { keyCode: 50 });
      }, 7000);

      setTimeout(() => {
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
              base64String = canvas
                .toDataURL("image/jpeg")
                .replace(/^.+?,/, "");
              let chars = atob(base64String);
              let bytes = new Array(chars.length);
              for (let i = 0; i < bytes.length; i++)
                bytes[i] = chars.charCodeAt(i);
              let byteArray = new Uint8Array(bytes);
              let blob = new Blob([byteArray], { type: "image/jpeg" });
              let fileOptions = { type: blob.type, size: blob.size };
              let name = Math.floor(Math.random() * 100 + 1) + ".jpg";
              transfer.items.add(new File([blob], name, fileOptions));
              setTimeout(() => {
                let input = $("#upl-fileInp")[0];
                input.files = transfer.files;
                $(input).dispatch("change");
              }, 2000);
            }
          });
      }, 25000);
      setInterval(() => {
        //document.getElementsByClassName("pbtn")[1].click(); //List item
        //setTimeout(() => {
          var eurl = document.getElementById("success_msg_title").href;
          console.log(eurl);
          if (eurl.substring(eurl.lastIndexOf("/") + 1) != "#itemId") {
            //https://www.ebay.com/itm/#itemId
            chrome.storage.sync.get("data", async (value) => {
              const token = value.data.token;
              if(token == null){
                fetch(
                `https://app.hammoq.com/images/url/${value.data.productid}`,
                {
                  method: "PUT",
                  body: JSON.stringify({ url: eurl, name: "ebay",clientid:value.data.clientid, domain:value.data.domain }),
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                  },
                }
              );
              }else{
                fetch(
                `https://app.hammoq.com/api/client/product/url/${value.data.productid}`,
                {
                  method: "PUT",
                  body: JSON.stringify({ url: eurl, name: "ebay",clientid:value.data.clientid, domain:value.data.domain }),
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                  },
                }
              );
              }
              
            });
            port.postMessage({ ebayanswer1: "listingebay" });
          }
        //}, 10000);
      }, 5000);
    });
  }, 400);
}
