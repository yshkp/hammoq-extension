
if (document.domain == "www.etsy.com") {
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
          document.getElementById("title").value = value.data.title
          document.getElementById("description").value = value.data.shortDescription
          $('#price_retail-input').val(value.data.price.replace(/[^\d.]/, '')).dispatch('input');
          console.log(value.data.price.replace(/[^\d.]/, ''))
          document.getElementById("quantity_retail-input").value = value.data.quantity
          document.getElementById("SKU-input").value = value.data.sku;
          if (value.data.material) {
            (async function () {
              let tagInput = $('#materials');
              let button = tagInput.parents('.col-xs-10').find('button');
              let tags = value.data.material.split(/\s*,\s*/).map(v => v.replace(/[^\w\s\d]/g, ''));
              let deleteButtons = tagInput.parents('.col-sm-8').find('.tag-close button');
              for (let i = 0; i < deleteButtons.length; i++) deleteButtons.eq(i).dispatch('click');
              for (let tag of tags) {
                tagInput.val(tag).dispatch('keyup', {keyCode: 50});
                button.dispatch('click');
                await waitForNode(`.tag-body:contains("${tag}")`);
              }
            })().then()
          }

          if (value.data.colorShade) {
            (async function() {
              let colorSelect;
              while (!colorSelect) colorSelect = await waitForNode('#attribute-2');
              let options = colorSelect.find('optgroup option');
              for (let i = 0; i < options.length; i++) {
                let option = options.eq(i);
                let color = option.text().toLowerCase();
                if (color === value.data.colorShade.toLowerCase()) {
                  colorSelect.val(option.attr('value')).dispatch('change');
                  break;
                }
              }
            })().then();
          }
          if (value.data.size) {
            (async function() {
              let sizeNode;
              while (!sizeNode) sizeNode = (await waitForNode('legend.strong:contains("Size")'));
              sizeNode = sizeNode.parents('.col-flush');
              let sizeType = sizeNode.find('[name="Scales"]');
              if (sizeType.length) {
                sizeType.val(sizeType.find('option:not([value=""])').eq(0).val()).dispatch('change');
                await wait(1);
              }
              let sizeVal = sizeNode.find('[name="Size"]');
              let options = sizeVal.find('option');
              for (let i = 0; i < options.length; i++) {
                let option = options.eq(i);
                if (option.text().toLowerCase() === value.data.colorShade.toLowerCase()) {
                  sizeVal.val(option.val()).dispatch('change');
                  break;
                }
              }
            })().then();
          }
          if (value.data.style) {
            (async function() {
              let node;
              while (!node) node = (await waitForNode('#attribute-378'));
              let opts = node.find('option');
              for (let opt of opts) {
                if ($(opt).text().toLowerCase() === value.data.style.toLowerCase()) {
                  node.val($(opt).val()).dispatch('change');
                  break;
                }
              }
            })().then();
          }
          if (value.data.keywords) {
            (async function() {
              let tagInput = $('#tags');
              let button = tagInput.parents('.col-xs-10').find('button');
              //let tags = value.data.keywords;
              let tags = value.data.keywords.split(/\s*,\s*/).map(v => v.replace(/[^\w\s\d]/g, ''));
              let deleteButtons = tagInput.parents('.col-sm-8').find('.tag-close button');
              for (let i = 0; i < deleteButtons.length; i++) deleteButtons.eq(i).dispatch('click');
              for (let tag of tags) {
                tagInput.val(tag).dispatch('keyup', {keyCode: 50});
                button.dispatch('click');
                await waitForNode(`.tag-body:contains("${tag}")`);
              }
            })().then()
          }

          if (value.data.weightLB || value.data.weightOZ) {
            (async function () {
              await waitForNode('#weight_primary');
              $('#weight_primary').val(value.data.weightLB.replace(/[^\d.]/g, '')).dispatch('blur');
              $('#weight_secondary').val(value.data.weightOZ.replace(/[^\d.]/g, '')).dispatch('blur');
            })().then();
          }
          if (value.data.packageHeight || value.data.packageWidth || value.data.packageLength) {
            (async function () {
              await waitForNode('#item_length');
              let sz = dt.shippingSize;
              let dim = ([value.data.packageLength, value.data.packageWidth, value.data.packageHeight])
                .map(a => parseInt(a.replace(/[^\d.]/g, '')))
                .sort((a, b) => (b > a ? 1 : b === a ? 0 : -1));
              $('#item_length').val(dim[0]).dispatch('blur');
              $('#item_width').val(dim[1]).dispatch('blur');
              $('#item_height').val(dim[2]).dispatch('blur');
            })().then();
          }
          if (dt.zip) {
            let setZipCode = async function () {
              (await waitForNode('[name="origin_postal_code"]')).val(value.data.zipCode);
              setZipCode().then();
            };
            setZipCode().then();
          }
          
          if(await getDebug('autofill')) {
            $('#who_made').val('i_did').dispatch('change');
            $('#is_supply').val('0').dispatch('change');
            $('#when_made').val('2020_2020').dispatch('change');
            $('#taxonomy-search').dispatch('focus');
            $('#taxonomy-search-results-option-0 a').dispatch('click');
            $('[name=source_shipping_profile]').eq(0).dispatch('click');
          }

        }, 2000);

     
        setTimeout(async () => {
          const token = value.data.token
          fetch(`http://localhost:8000/api/client/product/url/${value.data.productid}`, {
            method: "PUT",
            body: JSON.stringify({url:window.location.href, name:"esty"}),
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          })
        },10000);
    })
  }, 1500);
}