import { useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../misc/config'

function check(input, conditions, setter) {
    const validations = {}
    validations.value = input.value
    validations.isValid = false
    let inputClass = ''
    if(input.value) {
        for(let condition of conditions)
            if(condition.regex.test(input.value))
                validations[condition.key] = 'good'
            else
                validations[condition.key] = inputClass = 'bad'
        if(inputClass === '') {
            inputClass = 'good'
            validations.isValid = true
        }
    }
    input.classList = inputClass
    setter(validations)
}

export default function Profile({userData, functions}) {
    const [passwordChecks, checkPassword] = useState({})
    const [emailChecks, checkEmail] = useState({})
    return <>
        <div className='accountForm' id='profile'>
            <h1>Profile</h1>
            <div>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' readOnly defaultValue={userData.username}/>
            </div>
            <div>
                <label htmlFor='password'>Password: <button className={passwordChecks.isValid ? 'good' : 'bad'} onClick={() => functions.update({password: passwordChecks.value})}>Update</button></label>
                <div>
                    <input type='password' id='password' onChange={e => check(e.target, config.regex.password, checkPassword)}/>
                    <div className='popup'>
                        {config.regex.password.map(condition =>
                            <p className={passwordChecks[condition.key]} key={condition.key}>{condition.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor='email'>Email: <button className={emailChecks.isValid ? 'good' : 'bad'} onClick={() => functions.update({email: emailChecks.value})}>Update</button></label>
                <div>
                    <input type='email' id='email' defaultValue={userData.email} onChange={e => check(e.target, config.regex.email, checkEmail)}/>
                    <div className='popup'>
                        {config.regex.email.map(condition =>
                            <p className={emailChecks[condition.key]} key={condition.key}>{condition.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <div id='links'>
                <Link to={'/chat'}>Chat</Link>
                <button onClick={functions.logout}>Log out</button>
                <button onClick={() => {
                    const password = prompt('Write your password to delete the account')
                    if(!!password)
                        functions.deleteAccount(password)
                }}>Delete account</button>
            </div>
        </div>
    </>
}
