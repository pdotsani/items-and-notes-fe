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

	// useEffect(() => {
	// 	auth.onAuthStateChanged(user => {
	// 		if (user) {
  //   			console.log("User is signed in:", user);
    			
    			
  //   			setLoggedUser(user);
    		
  // 			} else {
  //   			console.log("No user is signed in.");
  // 			}
  // 			LoginEvent(user);
  // 		});
	// }, []);

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