import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';

import './LoginForm.css';

import GoogleIcon from '@mui/icons-material/Google';

function LoginForm({ LoginEvent, auth }) {
	const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
          console.log(result.user);
          LoginEvent(result.user)
        
      }).catch((error) => {
          console.error(error);
      });
	};

	return (
    <div className="container">
      <h1 className="app-title">TheraNotes</h1>
      <div className="google-button" onClick={signInWithGoogle}>
        <GoogleIcon className="google-icon" />
        Sign in with Google
      </div>
    </div>
  );

}
export default LoginForm;