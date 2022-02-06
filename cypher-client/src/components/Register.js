import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../misc/config'

function check(input, conditions, setter) {
    const validations = {}
    validations.value = input.value
    let inputClass = ''
    if(input.value) {
        for(let condition of conditions)
            if(condition.regex.test(input.value))
                validations[condition.key] = 'good'
            else
                validations[condition.key] = inputClass = 'bad'
        if(inputClass === '')
            inputClass = 'good'
    }
    input.classList = inputClass
    setter(validations)
}

export default function Register({functions}) {
    const [usernameChecks, checkUsername] = useState({})
    const [passwordChecks, checkPassword] = useState({})
    const [emailChecks, checkEmail] = useState({})
    const cPassword = useRef()

    function submit() {
        const username = usernameChecks.value
        const password = passwordChecks.value
        const email = emailChecks.value

        if(!username || !password || !email || !cPassword.current.value)
            console.log('empty fields')
        else if(!config.regex.username.map(condition => condition.regex.test(username)).reduce((prev, current) => prev && current))
            console.log('invalid username')
        else if(!config.regex.password.map(condition => condition.regex.test(password)).reduce((prev, current) => prev && current))
            console.log('invalid password')
        else if(password !== cPassword.current.value)
            console.log(`passwords don't match`)
        else if(!config.regex.email.map(condition => condition.regex.test(email)).reduce((prev, current) => prev && current))
            console.log('invalid email')
        else
            functions.register(username, password, email)
    }

    return <>
        <div className='accountForm'>
            <h1>Register</h1>
            <div>
                <label htmlFor='username'>Username:</label>
                <div>
                    <input id='username' type='text' onChange={e => check(e.target, config.regex.username, checkUsername)} autoComplete='off'/>
                    <div className='popup'>
                        {config.regex.username.map(condition =>
                            <p className={usernameChecks[condition.key]} key={condition.key}>{condition.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor='password'>Password:</label>
                <div>
                    <input id='password' type='password' onChange={e => check(e.target, config.regex.password, checkPassword)} /*defaultValue='qQ1!1234'*//>
                    <div className='popup'>
                        {config.regex.password.map(condition =>
                            <p className={passwordChecks[condition.key]} key={condition.key}>{condition.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor='cpassword'>Confirm password:</label>
                <div>
                    <input id='cpassword' type='password' ref={cPassword} /*defaultValue='qQ1!1234'*//>
                    <div className='popup'>
                        <p id='cpassCheck'>Same password</p>
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor='email'>Email:</label>
                <div>
                    <input id='email' type='email' onChange={e => check(e.target, config.regex.email, checkEmail)} autoComplete='off'/>
                    <div className='popup'>
                        {config.regex.email.map(condition =>
                            <p className={emailChecks[condition.key]} key={condition.key}>{condition.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <button onClick={submit}>Submit</button>
            <Link to={'/login'}>Already have an account? Log in</Link>
        </div>
    </>
}
