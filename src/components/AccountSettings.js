import React, { memo } from 'react';
// import '../styles/about.css';

const SettingsPage =  memo(function SettingsPage(props) {
  return (
    <div
        style={{
            position: 'relative',
            top: '95px',
            textAlign: 'left',
            width: '80%',
            margin: 'auto',
            paddingBottom: '90px'
        }}
    >     
        <div id="delwrapper">
            <button onClick={props.delAccount} id="delbutton" label="button to delete account" value="Delete your account">DELETE ACCOUNT</button>
        </div>
  </div>
  );
});
export default SettingsPage;
