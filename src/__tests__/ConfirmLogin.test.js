import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmLogin from '../components/forms/ConfirmLogin';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ConfirmLogin />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
 