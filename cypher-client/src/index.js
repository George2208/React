import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import io from 'socket.io-client'
import config from './misc/config'

import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Chat from './components/Chat'
import NotFound from './components/404'
import { ResizeTest } from './misc/resize'

const socket = io(config.server)

const functions = {
    register: (username, password, email) => socket.emit('register', {username, password, email}),
    login: (username, password) => socket.emit('login', {username, password}),
    update: data => socket.emit('update', data),
    logout: () => socket.emit('logout'),
    deleteAccount: password => socket.emit('deleteAccount', password),
    createRoom: room => socket.emit('createRoom', room)
}

const fail = message => alert(message)

// socket.emit('login', {username: 'user1', password: 'qQ1!1234'})
function App() {
    const [userData, setUserData] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
        console.log('--- SET LISTENERS ---')
        socket.onAny((ev, data) => console.debug(ev, data))
        socket.on('register', res => {
            if(!res.success) fail(res.message)
            else {
                setUserData(res.data)
                navigate('/profile')
                alert(`Registered as ${res.data.username}`)
            }
        })
        .on('login', res => {
            if(!res.success) fail(res.message)
            else {
                setUserData(res.data)
                navigate('/chat')
                alert(`Logged as ${res.data.username}`)
            }
        })
        .on('logout', res => {
            if(!res.success) fail(res.message)
            else {
                setUserData({})
                navigate('/login')
                console.log(`Logged out`)
            }
        })
        .on('update', res => {
            if(!res.success) fail(res.message)
            else {
                setUserData(res.data)
                alert(`Data updated`)
            }
        })
        .on('deleteAccount', res => {
            if(!res.success) fail(res.message)
            else {
                alert('Account deleted')
                setUserData({})
                navigate('/login')
            }
        })
        .on('disconnect', () => {
            alert('DISCONNECTED')
            setUserData({})
            navigate('/login')
        })
        return () => socket.off('register').off('login').off('update').off('deleteAccount')
    }, [])
    return <>
        <Routes>
            {!userData.username ? <>
                <Route path='/' element={<Login functions={functions}/>}/>
                <Route path='/login' element={<Login functions={functions}/>}/>
                <Route path='/register' element={<Register functions={functions}/>}/>
            </>:<>
                <Route path='/' element={<Chat userData={userData} socket={socket}/>}/>
                <Route path='/chat' element={<Chat userData={userData} socket={socket}/>} />
                <Route path='/profile' element={<Profile userData={userData} functions={functions}/>}/>
            </>}
            <Route path='/resize' element={<ResizeTest/>} />
            <Route path='/*' element={<NotFound/>}/>
        </Routes>
    </>
}

ReactDom.render(<>
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
</>, document.getElementById('root'))