import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from '../components/forms/SignUp';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SignUp />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
 