import React, { Component } from 'react';
import firebase from 'firebase/app';
import { fire } from '../../firebase';

class ConfirmLogIn extends Component {
  state = { 
    email: '',
    password: '',
    error: null
   };

  onSubmit = (event) => {
    const {
        email,
        password
      } = this.state;
    event.preventDefault();   
    const user = fire.auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
        email,
        password
    ); 
    user.reauthenticateAndRetrieveDataWithCredential(cred).then(() => {
        console.log('USER IS RE-AUTH!');
        this.props.delAccountAfterLogIn();
      }).catch((error) => {
        this.setState({ error });
      });
  }

  render() {
    const {
      email,
      password,
      error
    } = this.state;
      return (
        <div className="container">
        <h1 className="sign-in"><span>Confirm your details in order to delete your account</span></h1>
        <form onSubmit={this.onSubmit} autoComplete="off">
          <div className="col-75">
          <input
            value={email}
            onChange={event => this.setState({ email: event.target.value })}
            type="text"
            autoCapitalize="none"
            placeholder="Email Address"
            label="Enter email address"
          />
        </div>


          <div className="col-75">
          <input
            value={password}
            onChange={event => this.setState({ password: event.target.value })}
            type="password"
            placeholder="Password"
            autoCapitalize="none"
            label="Enter email password"
          />
          </div>
      <div className="col-75">
          <button disabled={!(email && password)} type="submit" label="confirm" value="confirm">
            Confirm
          </button>
          { error && <p className="error-form">{error.message}</p> }
      </div>

        </form>
        </div>
      );
  }
}

export default ConfirmLogIn;
