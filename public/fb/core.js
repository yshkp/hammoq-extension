
if (document.domain == "www.facebook.com" || document.domain == "facebook.com") {
  // var port = chrome.runtime.connect({name: "app"});
  // port.postMessage({fbintro: "hellofb"});
  // port.onMessage.addListener(async function(msg) {
  //   if (msg.fb1 == "list"){
  //     console.log(msg);
  //     port.postMessage({fbanswer1: "listing"});
  //   }else if (msg.actionfb == "list"){
  //     await console.log(msg);
  //     await setdata()
  //     await port.postMessage({fbanswer1: "listingfb"});
  //   }
  // });

  

//function setdata(){
  console.log("fb title");
  setTimeout(async () => {
      await document.getElementsByClassName("_54qk _43ff _4jy0 _4jy3 _4jy1 _51sy selected _42ft")[0].click()

      await setTimeout(() => {
        document.getElementsByClassName("_4e31")[0].click()
      },2000)
    
      
      await chrome.storage.sync.get("data", async (value) => {
      await setTimeout(() => {
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
        },3000)

      await setTimeout(async () => {
          
       
          
          $('[placeholder="What are you selling?"]')
          .val(value.data.title.substr(0, 100))
          .dispatch("input");

          setTimeout(async () => {
          $('[placeholder="Price"]')
          .val(value.data.price)
          .dispatch("input");
          }, 1000);

          // $('span[data-text="_1mf _1mj"]')[0]
          // .val("description")
          // .dispatch("input");
          setTimeout(async () => {
            let node = $('div[aria-label="Describe your item (optional)"]');
            if (node.find('span[data-text="true"]').length) {
              node.dispatch('focus');
              node.dispatch('selectstart');
              let selection = window.getSelection();
              let range = document.createRange();
              range.selectNodeContents(node[0]);
              selection.removeAllRanges();
              selection.addRange(range);
              node.dispatch('selectionchange');
              node.dispatch('keydown',
                {key: 'Backspace', code: 'Backspace', keyCode: 8, location: 0, composed: true});
            }
            let env = document.createEvent('TextEvent');
            env.initTextEvent('textInput', true, true, null, value.data.shortDescription);
            node[0].dispatchEvent(env)
          }, 1000);
          


          
      }, 2000);
    });
  }, 4000);
}
//}