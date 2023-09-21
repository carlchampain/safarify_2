import React from 'react';
import ReactDOM from 'react-dom';
import Autocomplete from '../components/Autocomplete';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Autocomplete />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
