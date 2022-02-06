const {connected, User, Room, Participant, showAll, Message} = require('./models')
const config = require('./config')

exports.connected = connected

exports.register = async data => {
    try {
        if(!data || !data.username || !data.password || !data.email)
            return {success: false, message: 'Invalid request'}
        if(!config.regex.username.test(data.username))
            return {success: false, message: 'Invalid username'}
        if(!config.regex.password.test(data.password))
            return {success: false, message: 'Invalid password'}
        if(!config.regex.email.test(data.email))
            return {success: false, message: 'Invalid email'}
        if((await User.findAll({raw: true, where: {username: data.username}})).length)
            return {success: false, message: 'Username already taken'}
        if((await User.findAll({raw: true, where: {email: data.email}})).length)
            return {success: false, message: 'Email already used'}
        await User.create({
            username: data.username,
            password: data.password,
            email: data.email
        })
        return {success: true, message: 'Account created'}
    }
    catch (error) {
        console.log(error.message)
        return {success: false, message: 'Internal server error'}
    }
}
exports.login = async data => {
    try {
        if(!data || !data.username || !data.password)
            return {success: false, message: 'Invalid request'}
        if(!(await User.findAll({raw: true, where: {username: data.username, password: data.password}})).length)
            return {success: false, message: 'Invalid username/password combination'}
        return {success: true, message: 'Logged in'}
    }
    catch (error) {
        console.log(error.message)
        return {success: false, message: 'Internal server error'}
    }
}
exports.deleteAccount = async (username, password) => {
    try {
        if(!await User.destroy({where: {username, password}}))
            return {success: false, message: 'Invalid password'}
        return {success: true, message: 'Account deleted'}
    }
    catch (error) {
        console.log(error.message)
        return {success: false, message: 'Internal server error'}
    }
}
exports.updateAccount = async (username, data) => {
    try {
        const updates = {}
        if(!data)
            return {success: false, message: 'Invalid request'}
        if(!(await User.findAll({raw: true, where: {username}})).length)
            return {success: false, message: 'Username does not exist'}
        if(data.email) {
            if(!config.regex.email.test(data.email))
                return {success: false, message: 'Invalid email'}
            updates.email = data.email
        }
        if(data.password) {
            if(!config.regex.password.test(data.password))
                return {success: false, message: 'Invalid password'}
            updates.password = data.password
        }
        if(Object.keys(updates).length === 0)
            return {success: false, message: 'Empty request'}
        await User.update(updates, {where: {username}})
        return {success: true, message: 'Account updated'}
    }
    catch (error) {
        console.log(error.message)
        return {success: false, message: 'Internal server error'}
    }
}
exports.profileData = async (username) => {
    try {
        const raw = (await User.findAll({raw: true, where: {username}}))[0]
        return Object.keys(raw)
        .filter(key => ['username', 'email'].includes(key))
        .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
        }, {})
    }
    catch (error) {
        console.log(error.message)
        return {username: '', password: ''}
    }
}

exports.createRoom = async (username, room) => {
    try {
        if((await Room.findAll({where: {room}})).length)
            return {success: false, message: "Room already exists"}
        if(!(await User.findAll({where: {username}})).length)
            return {success: false, message: "User does not exist"}
        await Room.create({room})
        await Participant.create({username, room})
        return {success: true, message: 'Room created', data: await Participant.findAll({raw: true, where: {username}, attributes: ['id', 'room']})}
    }
    catch (err) {
        console.log(err)
        return {success: false, message: 'Internal server error'}
    }
}
exports.joinRoom = async (username, room) => {
    try {
        if(!(await Room.findAll({where: {room}})).length)
            return {success: false, message: "Room does not exists"}
        if(!(await User.findAll({where: {username}})).length)
            return {success: false, message: "User does not exist"}
        if((await Participant.findAll({where: {username, room}})).length)
            return {success: false, message: "Already in this room"}
        await Participant.create({username, room})
        return {success: true, message: 'Room joined', data: await Participant.findAll({raw: true, where: {username}, attributes: ['id', 'room']})}
    }
    catch (err) {
        console.log(err)
        return {success: false, message: 'Internal server error'}
    }
}
exports.deleteRoom = async (username, room) => {
    try {
        if(!(await Room.findAll({where: {room}})).length)
            return {success: false, message: "Room does not exist"}
        if(!(await Participant.findAll({where: {room, username}})).length)
            return {success: false, message: "Only members can delete the room"}
        await Room.destroy({where: {room}})
        return {success: true, message: 'Room deleted'}
    }
    catch (err) {
        console.log(err)
        return {success: false, message: 'Internal server error'}
    }
}
exports.sendMessage = async (username, room, message) => {
    try {
        if(!message)
            return {success: false, message: "Empty message"}
        if(!room)
            return {success: false, message: "No room"}
        const participant = await Participant.findAll({raw:true, where: {room, username}})
        if(!participant.length)
            return {success: false, message: "Invalid participant"}
        const data = (await Message.create({
            participant: participant[0].id,
            message, room, username,
            date: Date.now()
        })).get({plain:true})
        return {success: true, username, room, message}
    }
    catch (err) {
        console.log('err')
        return {success: false, message: 'Internal server error'}
    }
}
exports.getMessages = async (username, room) => {
    try {
        if(!(await Room.findAll({where: {room}})).length)
            return {success: false, message: `Room ${room} does not exist`}
        if(!(await Participant.findAll({where: {room, username}})).length)
            return {success: false, message: "Only members can see the messages"}
        return {success: true, data: await Message.findAll({raw: true, where: {room}})}
    }
    catch (err) {
        console.log(err.message)
        return {success: false, message: 'Internal server error'}
    }
}
exports.getRooms = async username => {
    try {
        return {success: true, data: await Participant.findAll({raw: true, where: {username}, attributes: ['id', 'room']})}
    }
    catch (err) {
        console.log(err)
        return {success: false, message: 'Internal server error'}
    }
}
exports.addUserToRoom = async (username, room) => {
    try {
        if(!(await User.findAll({where: {username}})).length)
            return {success: false, message: "User does not exist"}
        if(!(await Room.findAll({where: {room}})).length)
            return {success: false, message: "Room does not exist"}
        if((await Participant.findAll({where: {username, room}})).length)
            return {success: false, message: "Already in room"}
        await Participant.create({username, room})
        return {success: true, message: "Room joined", room}
    }
    catch (err) {
        console.log(err)
        return {success: false, message: 'Internal server error'}
    }
}

async function test() {
    await connected
    await exports.register({
        username: 'user1',
        password: 'qQ1!1234',
        email: 'da@da.da'
    })
    await exports.register({
        username: 'user2',
        password: 'qQ1!1234',
        email: 'da2@da.da'
    })
    await exports.register({
        username: 'asdd',
        password: 'qQ1!1234',
        email: 'mail@da.da'
    })
    console.log(await exports.createRoom('user1', 'room1'))
    console.log(await exports.addUserToRoom('user2', 'room1'))
    console.log(await exports.addUserToRoom('asdd', 'room1'))
    // await showAll()

    
    console.log(await exports.getRooms('asdd'))
    console.log(await exports.sendMessage('user1', "room1", 'daa1'))
    console.log(await exports.sendMessage('user2', "room1", 'daa2'))
    console.log(await exports.sendMessage('user1', "room1", 'daa3'))
    console.log(await exports.sendMessage('user2', "room1", 'daa4'))
    console.log(await exports.sendMessage('user1', "room1", 'daa5'))
    // await showAll()
    // console.log(await exports.deleteRoom('user1', 'daa'))
    await showAll()

}
// test()
// showAll()