import React, { memo } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const MenuElems = memo(function MenuElems(props) {
  return (
    <IconMenu
      style={{
        marginTop: '22px', marginLeft: '14.5px', color: '#3d4591', fontSize: '15px', fontFamily: 'Roboto', fontWeight: 'medium', letterSpacing: '0.75px' }}
      iconButtonElement={
        <div>MENU</div>
      }
      targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
      <MenuItem
        primaryText="Search"
        onClick={props.searchClick}
      />
      <MenuItem
        primaryText="Log In / Sign Up"
        onClick={props.hasClickedOnLogIn}
        disabled={props.user !== null}
      />
      <MenuItem
        primaryText="Saved Animals"
        onClick={props.savedAnimals}
        disabled={props.user === null}
      />
      <MenuItem
        primaryText="Log Out"
        onClick={props.logOutClickAppjs}
        disabled={props.user === null}
      />
      <MenuItem
        primaryText="Account Settings"
        onClick={props.accountSettings}
        disabled={props.user === null}
      />
      <MenuItem
        primaryText="About Safarify"
        onClick={props.aboutClickApp}
      />
    </IconMenu>
  );
});
export default MenuElems;
