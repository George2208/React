import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ResizableH } from '../misc/resize'


export default function Chat({userData, socket}) {
    const [rooms, setRooms] = useState([])
    const [activeRoom, setActiveRoom] = useState()
    const [messages, setMessages] = useState([])
    const input = useRef()
    const messageList = useRef()
    function createRoom(room) { socket.emit('createRoom', room) }
    function joinRoom(room) { socket.emit('joinRoom', room) }
    function sendMessage(message) {
        console.log(activeRoom)
        socket.emit('message', {message, room: activeRoom})
    }
    useEffect(() => {
        function getRooms() { socket.emit('rooms') }
        socket.on('createRoom', res => {
            if(res.success)
                getRooms()
            else
                alert(res.message)
        })
        socket.on('joinRoom', res => {
            if(res.success)
                getRooms()
            else
                alert(res.message)
        })
        socket.on('rooms', rooms => setRooms(rooms.data))
        getRooms()
        return () => socket.off('createRoom').off('joinRoom')
    }, [socket])
    useEffect(() => {
        if(activeRoom) {
            socket.emit('getMessages', activeRoom)
            socket.on('getMessages', res => {
                console.log(res)
                if(res.success) {
                    setMessages(res.data)
                    messageList.current.scrollTop = messageList.current.scrollHeight
                }
                else
                    alert(res.message)
            })
            socket.on('message', res => {
                console.log(activeRoom)
                if(res.success)
                    socket.emit('getMessages', activeRoom)
                else
                    alert(res.message)
            })
            socket.on('newMessage', room => {
                console.log(room, activeRoom)
                if(room === activeRoom)
                    socket.emit('getMessages', activeRoom)
                else
                    console.log('new message in room', room)
            })
        }
        return () => socket.off('getMessages').off('message').off('newMessage')
    }, [socket, activeRoom])
    return <>
        <ResizableH sizeLeft={'30%'} left={
            <section>
                <div>Rooms</div>
                <div className='list'>
                    {rooms.length ? 
                        rooms.map(room => <button key={room.id} onClick={() => setActiveRoom(room.room)}>{room.room}</button>)
                    :
                        <div className='expander'>Create or join a room</div>
                    }
                </div>
                <div id='chatMenu'>
                    <button onClick={() => createRoom(prompt('Room name'))}>Create room</button>
                    <button onClick={() => joinRoom(prompt('Room name'))}>Join room</button>
                    <Link to={'/profile'}>{userData.username}</Link>
                </div>
            </section>
        } right={<section>
            {activeRoom ? <>
                <div>
                    <b>{activeRoom}</b>
                    <button>Delete room</button>
                </div>
                <div ref={messageList} className='list'>
                    {messages.map(message => 
                        <div className={'message' + (userData.username === message.username ? ' sent' : '')} key={message.id}>
                            <b>{message.username}</b>
                            <p>{message.message}</p>
                            <small>{(new Date(message.date)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                        </div>
                    )}
                </div>
                <div id='input'>
                    <input ref={input}/>
                    <button onClick={() => sendMessage(input.current.value)}>Send</button>
                </div>
            </>:<>
                <div className='expander'>Select a room</div>
            </>}
        </section>
        }/>
    </>
}
