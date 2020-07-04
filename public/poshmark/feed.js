if (document.domain == "poshmark.com") {
  setTimeout(() => {
    console.log("")
    window.location.href = document.getElementsByClassName("dropdown__link")[0].href
  }, 1500);

}

