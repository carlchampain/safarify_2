import React, { memo } from 'react';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

const NavBarMap = memo(function NavBarMap(props) {
    return (
          <div className="topnav-map">
              <NavigationArrowBack onClick={props.onLeftIconButtonClick} style={{ float: 'left', paddingLeft: '20px', zIndex: '30' }}/>
              <div id="name-map">{props.title}</div>
          </div>     
    );
});  

export default NavBarMap;
