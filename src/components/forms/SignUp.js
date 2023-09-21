import React, { Component } from 'react';
import { auth } from '../../firebase';
import LoadingContainer from '../LoadingContainer';

const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  isLoading: false
};

const byPropKey = (propertyName, value) => ({
  [propertyName]: value,
})

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { INITIAL_STATE };
  }

  onSubmit = (event) => {
    event.preventDefault();
      const {
      email,
      passwordOne,
    } = this.state;
    this.setState({ isLoading: true });
    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ INITIAL_STATE });
        this.props.updateAfterSignUp();
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
      });
  }

  render() {
  console.log('State from SignUp: ', this.state);
    const {
      email,
      passwordOne,
      passwordTwo,
      error,
      isLoading
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <LoadingContainer />
          <div className="loadingslow">Signing up...</div>
        </div>
      );
    }  
    return (
      <div className="container">
      <h1 className="sign-in"><span>Sign up</span></h1>
      <form onSubmit={this.onSubmit}>
          <div className="col-75">
            <input
              value={email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
              type="text"
              autoCapitalize="none"
              placeholder="Email Address"
              label="Email address"
            />
          </div>


          <div className="col-75">
            <input
              value={passwordOne}
              onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
              type="password"
              autoCapitalize="none"
              placeholder="Password"
              label="Password"
            />
          </div>


          <div className="col-75">
            <input
              value={passwordTwo}
              onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
              type="password"
              autoCapitalize="none"
              placeholder="Confirm Password"
              label="Confirm password"
            />
        </div>


          <div className="col-75">
            <button disabled={!(email && passwordOne && passwordTwo)} type="submit" label="sign up" value="sign up">
              Sign up
            </button>
          </div>  
            <div className="col-75">
              <button onClick={this.props.onClickLogInSpan} type="button" label="Back to Log In" value="Back to Log In">
                  Back to log in
              </button>
              { error && <p className="error-form">{error.message}</p> }
            </div>
      </form>
      </div>
    );
  }
}


export default SignUpForm;
