import React, { useState } from 'react';
import './App.css';

export default function Login({ onLogin }) {
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("Stu");

  const sendPOSTmethod = () => {
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('op').value;

    fetch('http://localhost:5014/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: userName, password, op: userType }),
    })
      .then(res => res.json())
      .then(data => {
        window.alert(data.message);
        setMessage(data.message);
        if (data.message !== 'Logged In Successfully') {
          console.log(userName, password, userType);
        } else {
          onLogin(userName, userType);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const callSignUp = () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const userType = document.getElementById('op').value;

    const postData = {
      username: user,
      password: pass,
      op: userType
    };

    fetch('http://localhost:5014/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Signup successful:', data);
        window.alert('Signup successful');
      })
      .catch(error => {
        console.error('Error:', error);
        window.alert('Error signing up: ' + error.message);
      });
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Book Store Application</h1>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <div className="input-group">
          <label htmlFor="op">User Type</label>
          <select id="op" value={userType} onChange={handleUserTypeChange}>
            <option value="Stu">Student</option>
            <option value="adm">Admin</option>
          </select>
        </div>
        <div className="button-group">
          <button onClick={sendPOSTmethod}>Login</button>
          {userType === "Stu" && <button onClick={callSignUp}>Signup</button>}
        </div>
      </div>
    </div>
  );
}
