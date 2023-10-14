import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GoogleApiWrapper from './components/MapContainer';
import Preloader from './components/Preloader';
// import { clickedCloseBtn } from './modules/MenuSlider';

function App() {
    return (
      <MuiThemeProvider>
        <div>
          <GoogleApiWrapper
          // onClick={() => clickedCloseBtn()}
          />
          <Preloader />
        </div>  
      </MuiThemeProvider>
    );
}

export default App;