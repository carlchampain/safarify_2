import React, { Component } from 'react';
import { auth } from '../../firebase';

class SendEmailReset extends Component {
  state = { 
    email: '',
    isEmailSent: false,
    error: ''
   };

  onSubmit = (event) => {
    const { email } = this.state;
    event.preventDefault();   
    auth.doPasswordReset(email)
        .then(() => {
            console.log('Email Sent!');
            this.setState({ isEmailSent: true });
        })
        .catch((error) => this.setState({ error }));
  }

  handleClickLogIn = () => {
      this.setState({ isEmailSent: false }, this.props.backToLogInForm);
  }

  render() {
    const {
      email,
      isEmailSent,
      error
    } = this.state;
    const isInvalid = (email === '');
    if (isEmailSent) {
        return (
            <div id="emailsent">
                <h1>
                    The email was successfully sent!
                </h1>
                <div className="col-75">
                    <button disabled={isInvalid} onClick={this.handleClickLogIn} type="submit" label="Send Email" value="Send Email">
                        SIGN IN
                    </button>
                </div>
            </div>
        );
    }
      return (
        <div className="container">
        <h1 className="sign-in"><span>Enter Your Email To Reset Your Password</span></h1>
        <form onSubmit={this.onSubmit}>
          <div className="col-75">
          <input
            value={email}
            onChange={event => this.setState({ email: event.target.value })}
            type="text"
            autoCapitalize="none"
            placeholder="Email Address"
            label="Email address"
          />
        </div>
      <div className="col-75">
          <button disabled={isInvalid} type="submit" label="Send Email" value="Send Email">
            Send email
          </button>
      </div>
      <div className="col-75">
            <button onClick={this.handleClickLogIn} type="button" label="Back to Log In" value="Back to Log In">
                Back to log in
            </button>
            { error && <p className="error-form">{error.message}</p> }
      </div>

        </form>
        </div>
      );
  }
}

export default SendEmailReset;
