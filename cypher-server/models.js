const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data.db',
    define: {timestamps: false},
    logging: false
})


const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Room = sequelize.define('room', {
    room: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
})

const Participant = sequelize.define('participant', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    room: {
        type: Sequelize.STRING,
        onDelete: 'cascade',
        references: {
            model: 'rooms',
            key: 'room'
        }
    },
    username: {
        type: Sequelize.STRING,
        onDelete: 'cascade',
        references: {
            model: 'users',
            key: 'username'
        }
    }
})

const Message = sequelize.define('message', {
    participant: {
        type: Sequelize.STRING,
        onDelete: 'cascade',
        references: {
            model: 'participants',
            key: 'id'
        }
    },
    room: {
        type: Sequelize.STRING,
        onDelete: 'cascade',
        references: {
            model: 'rooms',
            key: 'room'
        }
    },
    username: {
        type: Sequelize.STRING,
        onDelete: 'cascade',
        references: {
            model: 'users',
            key: 'username'
        }
    },
    message: Sequelize.STRING,
    date: Sequelize.DATE
})

const connected = new Promise(async resolve => {
    const timeout = setTimeout(() => {
        resolve(false)
    }, 1000)
    try {
        await sequelize.sync()
        // await sequelize.sync({force: true})
    } catch (error) {
        console.log(error)
    }
    clearTimeout(timeout)
    resolve(true)
})

async function showAll() {
    try {
        console.log('User       ', await User.findAll({raw: true}))
        console.log('Room       ', await Room.findAll({raw: true}))
        console.log('Participant', await Participant.findAll({raw: true}))
        console.log('Message    ', await Message.findAll({raw: true}))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { connected, User, Room, Participant, Message, showAll }