import React from 'react';
import ReactDOM from 'react-dom';
import MapVisible from '../components/MapVisible';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MapVisible />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
