import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';

import './LoginForm.css';

import GoogleIcon from '@mui/icons-material/Google';
import EditNoteIcon from '@mui/icons-material/EditNote';

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
      <div className="google-button">
        <GoogleIcon className="google-icon" onClick={signInWithGoogle}/>
        Sign in with Google
      </div>
    </div>
  );

}
export default LoginForm;