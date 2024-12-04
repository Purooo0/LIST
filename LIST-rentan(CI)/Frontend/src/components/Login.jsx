import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./Login.css";

import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          const datas = await response.json();
          
          if (response.status === 200) {
            setShowToast(true);
            navigate(`/habit/${username}`);
          } 
          else if (response.status === 500){
            alert(`${datas.error}`);
          }
          else {
          alert(`${datas.message}`);
        }
        } catch (error) {
          alert('There was an error. Please try again later.');
        }
      };
    
    
    function togglePasswordVisibility() {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <div className='bgl'>
        {showToast && (
    <Toast>
        <div className='toastregisterlogosuccessl'>
            <HiCheck className="h-7 w-7" />
        </div>
        <div className='toastregistertextsuccessl'>Registration Successful!</div>
        <Toast.Toggle className='toastregisterclosel'/>
    </Toast>
)}
            <form className="form-containerl"  onSubmit={handleLogin}>
                <h1 className='text_titleregl'>Log In MyLists Account</h1>
                <div className='margl'>
                    <label htmlFor="username" className='textl'>Username</label>
                    <input type="text" id="username" className='input_boxl' placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="margl">
                    <label htmlFor="password" className="textl">Password</label>
                    <input type={passwordVisible ? "text" : "password"} id="password" className="input_boxl" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="button" className='visibilityl' id='toggle-password' onClick={togglePasswordVisibility}>
    {passwordVisible ? "👁️‍🗨️" : "👁️‍🗨️"}
</button>

                <h2 className='to_loginl'>Don't have an account?</h2>
                <Link to={`/register`} className='to_register_linkl'>Create</Link>
                <button type="submit" className='buttonl'>Login</button>
            </form>
        </div>
    );
}

export default Login;
