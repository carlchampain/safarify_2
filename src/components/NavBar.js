import React, { memo } from 'react';
import logo from '../bear.png';
import { clickedCloseBtn, clickedOnIcon, clickedOnIconFilter, clickedCloseBtnFilter } from '../modules/MenuSlider';


const NavBar = memo(function NavBar(props) {
    return (
      <div>
        <div className="sidenav">
          <div className="closebtn" onClick={clickedCloseBtn}>&times;</div>
          <div className="active" onClick={props.searchClick}>Search</div>
          {
            (props.user !== null)
            ?
            null
            :
            <div className="active" onClick={props.hasClickedOnLogIn}>Log In / Sign Up</div>
          }
          {
            (props.user !== null)
            ?
            <div className="active" onClick={props.savedAnimals}>Saved Animals</div>
            :
            null
          } 
          {
            (props.user !== null)
            ?
            <div className="active" onClick={props.logOutClickAppjs}>Log Out</div>
            :
            null
          } 
          
          {
            (props.user !== null)
            ?
            <div className="active" onClick={props.accountSettings}>Account Settings</div>
            :
            null
          }
          <div className="active" onClick={props.aboutClickApp}>About Safarify</div>
        </div> 
        <div className="sidenav">
          <div className="closebtn" onClick={clickedCloseBtnFilter}>&times;</div>
          <div className="active" onClick={props.getMoreSpecific}>Mammals</div>      
            <div className="active" onClick={props.getMoreSpecific}>Birds</div>
            <div className="active" onClick={props.getMoreSpecific}>Reptiles</div>
            <div className="active" onClick={props.getMoreSpecific}>Amphibians</div>
            <div className="active" onClick={props.getMoreSpecific}>Insects</div>
            <div className="active" onClick={props.getMoreSpecific}>Arachnids</div>
            <div className="active" onClick={props.getMoreSpecific}>All Results</div>
        </div>
        <div className="topnav" id="myTopnav">
        <img id="safarify-logo" alt="logo" src={logo} height="55px"onClick={props.handleTitleClick}/>
        <div id="filter" onClick={clickedOnIconFilter}><i className="material-icons">filter_list</i></div>
          <div className="icon" onClick={clickedOnIcon}>
        
          <i className="material-icons">menu</i>
 
          </div>
          
        </div>
      </div>
    );
});    

export default NavBar;
