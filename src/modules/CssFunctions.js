export const moveUpSearch = (arg, argOne) => {
  const formId = document.getElementsByClassName('formId')[0];
  const filter = document.getElementById('filter').style;
  if (formId) {
    window.requestAnimationFrame(() => {
      formId.classList.add(argOne);
      let menu = document.getElementsByClassName("sidenav")[0];
      menu.className = "sidenav";
    });
  }
  filter.visibility = arg;
};

export const aboutClickCSS = () => {
  const filter = document.getElementById('filter').style;
  filter.visibility = 'hidden';
  let menu = document.getElementsByClassName("sidenav")[0];
  window.requestAnimationFrame(() => menu.className = "sidenav");  
};
