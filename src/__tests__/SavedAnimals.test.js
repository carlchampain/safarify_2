import React from 'react';
import ReactDOM from 'react-dom';
import SavedAnimals from '../components/SavedAnimals';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SavedAnimals />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
