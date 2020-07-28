var port = chrome.runtime.connect({ name: "app" });
port.postMessage({ mercariintro: "hellomercari" });
port.onMessage.addListener(function (msg) {
  if (msg.actionmercari == "listmercari") {
    console.log(msg);
    setdata();
  }
});
function setdata() {
  setTimeout(() => {
    chrome.storage.sync.get("data", async (value) => {
      console.log(value.data);
      setTimeout(async () => {
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
              setTimeout(() => {
                let input = $('[type="file"]')[0];
                input.files = transfer.files;
                $(input).dispatch("change");
              }, 2000);
            }
          });
      }, 10000);
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

        //brand
        setTimeout(() => {
          if (value.data.brand) {
            let input = $('[placeholder="Select brand"]');
            if (input.length) {
              let brand = value.data.brand.toLowerCase().trim();
              input.val(value.data.brand).dispatch("input");
              let gotSuggestion = false;
              setTimeout(() => {
                var childnodes = document.getElementsByClassName(
                  "Autosuggest__Items-sc-1xjs9ds-2 fwAroE"
                )[0].childNodes;
                for (let i = 0; i < childnodes.length; i++) {
                  if (childnodes[i].innerText.toLowerCase() == brand) {
                    document
                      .getElementsByClassName(
                        "Autosuggest__HighlightWrapper-sc-1xjs9ds-5 fKpxlV"
                      )
                      [i].click();
                    gotSuggestion = true;
                  }
                }
              }, 2000);

              if (!gotSuggestion)
                console.log("No brand suggestion, cant set it");
            } else console.log("No brand input, cant set it");
          }
        }, 7000);

        //tags
        setTimeout(() => {
	        if (value.data.keywords) {
	          for (let i = 0; i < 3; i++) {
	            if (value.data.keywords.split(",").length > i) {
	            	var el = $('*[placeholder="Add a hashtag"]');
	              el[i].value = "#" + value.data.keywords.split(",")[i];
	            }
	          }
	        }
    	},2000)

        //color
        if (value.data.colorShade) {
          setTimeout(() => {
            document.getElementById("itemColorId").click();
            setTimeout(() => {
              var ul = document.getElementsByClassName(
                "Options__SelectOptionsContainer-sc-1hj1ojw-0 fKkByN"
              )[0];

              var items = ul.getElementsByTagName("li");
              for (var i = 0; i < items.length; ++i) {
                //loop over li elements
                if (
                  items[i].innerHTML.toLowerCase() ==
                  value.data.colorShade.toLowerCase()
                ) {
                  var itemid = items[i].id;
                  document.getElementById(itemid).click();
                }
              }
            }, 2000);
          }, 2000);
        }

        if(value.data.zipCode != ""){
        	$('[placeholder="Input Zip code"]')
          .dispatch("focus")
          .dispatch("focus")
          .val(value.data.zipCode)
          .dispatch("input")
          .dispatch("blur");
        }
        
        if(value.data.price != ""){
        	$('[placeholder="(min.$5/max.$2,000)"]')
          .dispatch("focus")
          .val(parseInt(value.data.price.replace(/[^\d.]/, "")))
          .dispatch("input")
          .dispatch("blur");
        }
        
      }, 4000);

      // setTimeout(() => {
      // window.location.reload()
      // },2000);

      // setTimeout(async () => {
      //   // await waitForNode(".Button__PrimaryButton-xht50r-0 Button__SecondaryButton-xht50r-1 bWXZIN")
      //   //    .dispatch("click")
      //   document.getElementsByTagName("button")[7].click();
      // }, 25000);
    });
  }, 1500);
}
