const config = {
    server: 'http://localhost:8080',
    regex: {
        username: [
            {
                key: 1,
                message: 'Alphanumerical and underscore',
                regex: /^[a-zA-Z\d_]+$/
            },
            {
                key: 2,
                message: 'At least 4 characters',
                regex: /^.{4,}$/
            },
            {
                key: 3,
                message: 'At most 30 characters',
                regex: /^.{1,30}$/
            }
        ],
        password: [
            {
                key: 1,
                message: 'At least one digit',
                regex: /^(?=.*\d).*$/
            },
            {
                key: 2,
                message: 'At least one lowercase letter',
                regex: /^(?=.*[a-z]).*$/
            },
            {
                key: 3,
                message: 'At least one uppercase letter',
                regex: /^(?=.*[A-Z]).*$/
            },
            {
                key: 4,
                message: 'At least one special character',
                regex: /^(?=.*["\-/\\\] !#$%&'()*+,.:;<=>?@[^_`{|}~]).*$/
            },
            {
                key: 5,
                message: 'At least 8 characters',
                regex: /^.{8,}$/
            },
            {
                key: 6,
                message: 'At most 50 characters',
                regex: /^.{1,50}$/
            }
        ],
        email: [
            {
                key: 1,
                message: 'Valid email',
                regex: /^\S+@\S+\.\S+$/
            },
            {
                key: 2,
                message: 'At most 30 characters',
                regex: /^.{1,30}$/
            }
        ]
    }
}

export default config