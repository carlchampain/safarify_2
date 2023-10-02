import React, { Component } from 'react';
import { auth } from '../../firebase';
import LoadingContainer from '../LoadingContainer';
import SignUpForm from './SignUp';
import SendEmailReset from './ForgotPass';

const byPropKey = (propertyName, value) => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  hasSignedUp: false,
  isSignedOut: true,
  isSignedIn: false,
  hasForgotPass: false,
  isLoading: false
};

class SignInForm extends Component {

  state = { INITIAL_STATE };

  onSubmit = (event) => {
    event.preventDefault();
    const {
      email,
      password
    } = this.state;
    this.setState({ isLoading: true });
    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE, isSignedIn: true, isSignedOut: false }, this.props.signIn);
      })
      .catch(error => {
        this.setState({ error, isLoading: false});
      });
  }

  onClickSignUp = () => {
    this.setState({ hasSignedUp: !this.state.hasSignedUp, error: null });
  }

  onClickSignUpBis = () => {
    this.setState({ ...INITIAL_STATE, isSignedIn: true, isSignedOut: false }, this.props.signIn);
    //hasSigned is in fact signed up (true) but to move it from screen has to be set to false
    // this.setState({ hasSignedUp: false, isSignedIn: true, isSignedOut: false }, this.props.signUpDotsMenuUpdate);
  }

  onClickForgot = () => {
    this.setState({ hasForgotPass: true, hasSignedUp: false, isSignedIn: false, isSignedOut: true, error: null });
  }

  backToLogInForm = () => {
    this.setState({ ...INITIAL_STATE, hasForgotPass: false }, () => console.log('BACK TO LOG IN FORM'));
  }

  render() {
    const {
      isSignedIn,
      email,
      password,
      error,
      hasSignedUp,
      hasForgotPass,
      isLoading
    } = this.state;
    
    if (isLoading) {
      return (
        <div>
          <LoadingContainer />
        </div>
      );
    }
    if (hasSignedUp) {
      return (
        <SignUpForm
        updateAfterSignUp={this.onClickSignUpBis}
        onClickLogInSpan={this.onClickSignUp}
        />
      );
    }
    if (hasForgotPass) {
      return (<SendEmailReset 
                backToLogInForm={this.backToLogInForm} 
                onClickBackToLogIn={this.onClickSignUp}
              />
             );
    }
    if (!isSignedIn) {
      return (
        <div className="container">
        <h1 className="sign-in"><span>Log in to Safarify</span></h1>
        <form onSubmit={this.onSubmit} autoComplete="off">

          <div className="col-75">
          <input
            value={email}
            onChange={event => this.setState(byPropKey('email', event.target.value))}
            type="text"
            autoCapitalize="none"
            placeholder="Email"
            label="Email address"
          />
        </div>


          <div className="col-75">
          <input
            value={password}
            onChange={event => this.setState(byPropKey('password', event.target.value))}
            type="password"
            autoCapitalize="none"
            placeholder="Password"
            label="Password"
          />
          </div>
      <div className="col-75">
          <button disabled={!(email && password)} type="submit" label="sign in" value="sign in">
            Log in
          </button>
          { error && <p className="error-form">{error.message}</p> } 
      </div> 
      <div className="col-75">    
            <h1 className="sign-in">Don't have an account?</h1>
            <button type="button" label="Sign Up" value="Sign Up" onClick={this.onClickSignUp}>
              Sign up
            </button>
      </div> 
      <div className="col-75">   
        <h1 className="sign-in">Forgot password?</h1>
          <button type="button" label="Click Here" value="Click Here" onClick={this.onClickForgot}>
            Click here
          </button>
      </div>    
        </form>
        </div>
      );
    } 
      return (
        <div className="nosavedcards">
          <h1>You are logged in!</h1>
        </div>
      );
  }
}

export default SignInForm;
