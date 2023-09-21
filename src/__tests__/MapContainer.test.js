import React from 'react';
import ReactDOM from 'react-dom';
import GoogleApiWrapper from '../components/MapContainer';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GoogleApiWrapper />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
