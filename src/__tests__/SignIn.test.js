import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from '../components/forms/SignIn';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SignIn />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  