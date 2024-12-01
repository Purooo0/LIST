import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./App.css";

import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

function Register() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);


    const handleRegister = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
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
        <div className='bg'>
        {showToast && (
    <Toast>
        <div className='toastregisterlogosuccess'>
            <HiCheck className="h-7 w-7" />
        </div>
        <div className='toastregistertextsuccess'>Registration Successful!</div>
        <Toast.Toggle className='toastregisterclose'/>
    </Toast>
)}
            <form className="form-container"  onSubmit={handleRegister}>
                <h1 className='text_titlereg'>Create MyLists Account</h1>
                <div className='marg'>
                    <label htmlFor="email" className='text'>E-mail </label>
                    <input type="email" id="email" className='input_box' placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className='marg'>
                    <label htmlFor="username" className='text'>Username</label>
                    <input type="text" id="username" className='input_box' placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="marg">
                    <label htmlFor="password" className="text">Password</label>
                    <input type={passwordVisible ? "text" : "password"} id="password" className="input_box" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="button" className='visibility' id='toggle-password' onClick={togglePasswordVisibility}>
    {passwordVisible ? "👁️‍🗨️" : "👁️‍🗨️"}
</button>

                <h1 className='text_password'>*min 8 characters</h1>
                <h2 className='to_login'>Already have an account?</h2>
                <Link to={`/login`} className='to_login_link'>Login</Link>
                <button type="submit" className='button'>Register</button>
            </form>
        </div>
    );
}

export default Register;
