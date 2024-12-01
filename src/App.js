import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import './App.css';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginForm from './LoginForm'
import HomepageBody from './HomepageBody';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function App() {
	const [user, setUser] = useState(null);
	
  function HandleLogin(user) {
		setUser(user);
	}

  async function logoutGoogle () {
		try {
      await auth.signOut();
      setUser(null)
    } catch (error) {
      console.error(error);
    }
	}
	
  return (
    <div >
      {user ?
        <div className="homepage">
          <div className="nav">
            <div>Welcome {user.displayName}</div>
            <div className="logout-button" onClick={logoutGoogle}>
              <LogoutIcon fontSize="small" />
              Logout
            </div>
          </div>
          <HomepageBody user={user} />
        </div>:
        <LoginForm LoginEvent={HandleLogin} auth={auth} />
      }
    </div>
  );
}

export default App;