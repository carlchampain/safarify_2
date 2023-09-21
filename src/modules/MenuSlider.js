export function clickedOnIcon() {
  let menu = document.getElementsByClassName("sidenav")[0];
  window.requestAnimationFrame(() => menu.className += " open-sidenav");
}
export function clickedOnIconFilter() {
  let menu = document.getElementsByClassName("sidenav")[1];
  if(document.getElementsByClassName("sidenav open-sidenav")[0]) {
    window.requestAnimationFrame(() => menu.className = "sidenav");
  } else {
    window.requestAnimationFrame(() => menu.className += " open-sidenav");
  }
}
export function clickedCloseBtn() {
  let menu = document.getElementsByClassName("sidenav")[0];
  window.requestAnimationFrame(() => menu.className = "sidenav");
}
export function clickedCloseBtnFilter() {
  let menu = document.getElementsByClassName("sidenav")[1];
  window.requestAnimationFrame(() => menu.className = "sidenav");
}