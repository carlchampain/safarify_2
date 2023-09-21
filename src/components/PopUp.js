import React, { memo } from 'react';
import RaisedButton from 'material-ui/FlatButton';
// import '../styles/PopUp.css';

const PopUp = memo(function PopUp(props) {
  return (
    <div>
      <div className='popup'>
        <div className='popup_inner'>
          <h1 id="pleaselogin" style={{ color: 'white' }}>Log in first to like an animal!</h1>
        <RaisedButton
        backgroundColor="#3d4591"
        style={{ color: 'white', marginTop: '10px' }}
        primary
        id="popuplogin"
        onClick={props.handlePopUp}
        >
        Log In
        </RaisedButton>
        <RaisedButton
          id="popupclose"
          backgroundColor="#3d4591"
          style={{ color: 'white', marginTop: '10px' }}
          secondary
          onClick={props.closePopUp}
        >
          close me
        </RaisedButton>
        </div>
      </div>
    </div>
  );
});  
export default PopUp;
