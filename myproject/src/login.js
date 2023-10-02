import React, { useState } from 'react';
import Main from './Admin';
import './login.css';
const AdminLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showReport,setShowReport]= useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const handleLogin = () => {
    // Simulate an admin login process here
    if (username === 'admin' && password === 'umadevi') {
      setLoggedIn(true);
      setShowReport(true);
      setShowButtons(false);
    } else {
      alert('Invalid username or password');
    }
  };
  const handleBack = () => {
    // Handle the back button click here
    window.location.reload();
  };
  return (
    <div>
      <button onClick={handleBack} className="backbutton">Back</button>
      { loggedIn ? (
        <div>
          {showReport && <Main />}
        </div>
      ) : (
        <form>
          <label>
            Admin Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Admin Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handleLogin}>
            Log In as Admin
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminLoginForm;
