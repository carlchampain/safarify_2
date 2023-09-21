import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GoogleApiWrapper from './components/MapContainer';
// import { clickedCloseBtn } from './modules/MenuSlider';

function App() {
    return (
      <MuiThemeProvider>
          <GoogleApiWrapper
          // onClick={() => clickedCloseBtn()}
          />
      </MuiThemeProvider>
    );
}

export default App;