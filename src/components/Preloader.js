import React from 'react';
import svgArrow from '../down-arrow-svgrepo-com.svg';

function Preloader() {
  return (
    <div id="preloader-container">
      <img alt="arrow" src={svgArrow}></img>
    </div>
  );
}

export default Preloader;
