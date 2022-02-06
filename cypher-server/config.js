module.exports = {
    dbPath: './data.db',
    regex: {
        username: /^[a-zA-Z\d_]{4,}$/,
        password: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*["\-\/\\\] !#$%&'()*+,.:;<=>?@[^_`{|}~]).{8,}/,
        email: /^\S+@\S+\.\S+$/
    }
}
