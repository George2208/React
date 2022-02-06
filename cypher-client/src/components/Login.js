import { useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Login({functions}) {
    const username = useRef()
    const password = useRef()
    return <>
        <div className='accountForm'>
            <h1>Log in</h1>
            <div>
                <label htmlFor='username'>Username:</label>
                <input id='username' type='text' ref={username} autoComplete='off'/>
            </div>
            <div>
                <label htmlFor='password'>Password:</label>
                <input id='password' type='password' ref={password} /*defaultValue='qQ1!1234'*//>
            </div>
            <button onClick={() => functions.login(username.current.value, password.current.value)}>Submit</button>
            <Link to={'/register'}>Don't have an account? Register</Link>
        </div>
    </>
}
