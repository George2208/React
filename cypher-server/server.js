const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer()
const io = new Server(httpServer, {cors: {origin: "*"}})

const controller = require('./controller')

function log(message) {
    if(true)
        console.log(message)
}

io.on('connection', socket => {
    let user = null
    socket.on('register', async req => {
        const res = await controller.register(req)
        if(res.success) {
            user = req.username
            log(`${user} registered`)
            res.data = await controller.profileData(user)
            for(let room of (await controller.getRooms(user)).data)
                socket.join(room.room)
        }
        socket.emit('register', res)
    })
    .on('login', async req => {
        const res = await controller.login(req)
        if(res.success) {
            user = req.username
            log(`${user} logged`)
            res.data = await controller.profileData(user)
            for(let room of (await controller.getRooms(user)).data)
                socket.join(room.room)
        }
        socket.emit('login', res)
    })
    .on('logout', async () => {
        console.log(`${user} logged out`)
        user = null
        socket.emit('logout', {success: true})
    })
    .on('disconnect', async () => {
        if(user)
            log(`${user} disconnected`)
        user = null
    })
    // ! only for authenticated sockets
    .on('deleteAccount', async password => {
        if(user) {
            log(password)
            const res = await controller.deleteAccount(user, password)
            if(res.success)
                user = null
            socket.emit('deleteAccount', res)
        }
    })
    .on('update', async req => {
        if(user) {
            const res = await controller.updateAccount(user, req)
            res.data = await controller.profileData(user)
            console.log(res)
            socket.emit('update', res)
        }
    })
    .on('createRoom', async room => {
        if(user) {
            const res = await controller.createRoom(user, room)
            if(res.success)
                socket.join(room)
            socket.emit('createRoom', res)
        }
    })
    .on('joinRoom', async room => {
        if(user) {
            let res = await controller.joinRoom(user, room)
            if(res.success)
                socket.join(room)
            socket.emit('joinRoom', res)
        }
    })
    .on('deleteRoom', async room => {
        if(user) {
            socket.emit('deleteRoom', await controller.deleteRoom(user, room))
        }
    })
    .on('rooms', async () => {
        if(user)
            socket.emit('rooms', await controller.getRooms(user))
    })
    .on('getMessages', async room => {
        if(user)
            socket.emit('getMessages', await controller.getMessages(user, room))
    })
    .on('message', async data => {
        if(user) {
            const res = await controller.sendMessage(user, data.room, data.message)
            if(res.success) {
                console.log('broadcast to ', data.room)
                socket.to(data.room).emit('newMessage', data.room)
            }
            socket.emit('message', res)
        }
    })
})

controller.connected.then(connected => {
    if(connected) {
        console.log('Database connected')
        httpServer.listen(8080, () => console.log('Server online'))
    } else {
        console.log('Database connection timed out')
    }
})

