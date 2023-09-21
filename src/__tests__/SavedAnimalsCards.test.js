import React from 'react';
import ReactDOM from 'react-dom';
import SavedAnimalsCards from '../components/SavedAnimalsCards';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SavedAnimalsCards />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
