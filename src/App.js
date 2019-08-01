import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GoogleApiWrapper from './components/MapContainer';

function App() {
    return (
      <MuiThemeProvider>
          <GoogleApiWrapper
          />
      </MuiThemeProvider>
    );
}

export default App;