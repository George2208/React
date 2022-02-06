exports.test_register = async f => {
    console.log(`--- ${f.name} tests ---`)
    console.log(await f({
        username: 'test',
        password: 'qQ1!1234',
        email: 'test@test.test'
    }))
    console.log(await f({
        username: 'test',
        password: 'qQ1!1234'
    }))
    console.log(await f({
        username: '-',
        password: 'qQ1!1234',
        email: 'test@test.test'
    }))
    console.log(await f({
        username: 'test',
        password: '-',
        email: 'test@test.test'
    }))
    console.log(await f({
        username: 'test',
        password: 'qQ1!1234',
        email: '-'
    }))
    console.log(await f({
        username: 'test',
        password: 'qQ1!1234',
        email: 'test@test.test'
    }))
    console.log(await f({
        username: 'test',
        password: 'qQ1!1234',
        email: 'test@test.test'
    }))
}
exports.test_login = async f => {
    console.log(`--- ${f.name} tests ---`)
    console.log(await f({
        username: 'test'
    }))
    console.log(await f({
        username: 'test',
        password: '-'
    }))
    console.log(await f({
        username: 'test',
        password: 'qQ1!1234'
    }))
}
exports.test_deleteAccount = async f => {
    console.log(`--- ${f.name} tests ---`)
    console.log(await f('test', '-'))
    console.log(await f('test', 'qQ1!1234'))
}
exports.test_updateAccount = async f => {
    console.log(`--- ${f.name} tests ---`)
    console.log(await f('test', {}))
    console.log(await f('test', {
        email: "-"
    }))
    console.log(await f('test', {
        email: "test2@test.test"
    }))
    console.log(await f('test', {
        password: "-"
    }))
    console.log(await f('test', {
        password: "qQ1!1234"
    }))
    console.log(await f('test', {
        email: "test3@test.test",
        password: "qQ1!12343"
    }))
}
exports.test_profileData = async f => {
    console.log(`--- ${f.name} tests ---`)
    console.log(await f('-'))
    console.log(await f('test'))
}

