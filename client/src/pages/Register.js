import React, {useContext, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"
import {Credentials} from "../App";
import './RegisterLogin.css'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [, setCredentials] = useContext(Credentials)

    const requestBody = JSON.stringify({
        username,
        password
    })
    const register = e => {
        e.preventDefault()

        if (!username.trim() || !password.trim()) {
            setError('Username and password cannot be empty.')
            return
        }

        axios.post('/api/register',
            requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setCredentials({
                    username,
                    password,
                })
                navigate('/')
            })
            .catch(err => {
                    if (err.response) {
                        setError(err.response.data)
                    }
                }
            )
    }


    return (
        <div className='loginRegisterContainer'>
            <h1>Register</h1>
            {error && (<div className='errorMsg' style={{color: 'red'}}>{error}</div>)}
            <form onSubmit={register}>
                <label htmlFor=""><h5>Username</h5></label>
                <input type="text"
                       onChange={e => setUsername(e.target.value)}
                />
                <br/>
                <label htmlFor=""><h5>Password</h5></label>
                <input type="password"
                       onChange={e => setPassword(e.target.value)}
                />
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register