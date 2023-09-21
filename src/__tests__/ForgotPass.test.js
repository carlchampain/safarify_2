import React from 'react';
import ReactDOM from 'react-dom';
import SendEmailReset from '../components/forms/ForgotPass';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SendEmailReset />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
 