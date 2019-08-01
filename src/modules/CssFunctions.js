export const moveUpSearch = () => {
  const formId = document.getElementsByClassName('formId')[0];
  const filter = document.getElementById('filter').style;
  if (formId) {
    window.requestAnimationFrame(() => {
      formId.classList.add('moveUp');
      filter.visibility = 'visible';
      let menu = document.getElementsByClassName("sidenav")[0];
      menu.className = "sidenav";
    });
  }
};

export const aboutClickCSS = () => {
  const filter = document.getElementById('filter').style;
  filter.visibility = 'hidden';
  let menu = document.getElementsByClassName("sidenav")[0];
  window.requestAnimationFrame(() => menu.className = "sidenav");  
};
