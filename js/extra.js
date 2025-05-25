document.addEventListener("keydown", event => {
  if (event.key == "ArrowRight") {
    let link = document.querySelector("a[rel=next]");
    if (link) link.click();
  } else if (event.key == "ArrowLeft") {
    let link = document.querySelector("a[rel=prev]");
    if (link) link.click();
  } else if (event.key == " ") {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      let link = document.querySelector("a[rel=next]");
      if (link) link.click();
    }
  }
})
