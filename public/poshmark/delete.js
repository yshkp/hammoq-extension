deletess()

function deletess(){
  setTimeout(() => {
    setTimeout(() => {
              document.getElementsByClassName('td--ul tc--lg')[0].click()//delete item button
      },5500);

     setTimeout(() => {
                document.getElementsByClassName('btn btn--primary')[11].click()//yes confirm button
      },5500);

     console.log("delisted done")
     //localStorage.setItem("assert",false)
  },5500);
}

