const fs = require("fs");

let adminsFile = fs.readFileSync("./src/admins.json");
let usersFile = fs.readFileSync("./src/users.json");

// [ { token, name, time } ]
let admins = JSON.parse(adminsFile.toString());
// [ { token, time } ]
let users = JSON.parse(usersFile.toString());

// 60 s * 60 m * 24 h * 7d
let sevenDays = 1000 * 60 * 60 * 24 * 7;

// cleanup
let current = Date.now();
for(let i = 0; i < admins.length; i++) {
    let time = admins[i].time;
    if(current - time > sevenDays) {
        admins.splice(i, 1);
        i--;
    }
}
for(let i = 0; i < users.length; i++) {
    let time = users[i].time;
    if(current - time > sevenDays) {
        users.splice(i, 1);
        i--;
    }
}

updateDatabases();

async function updateDatabases() {
    await fs.promises.truncate("./src/admins.json");
    await fs.promises.truncate("./src/users.json");
    await fs.promises.writeFile("./src/admins.json", JSON.stringify(admins));
    await fs.promises.writeFile("./src/users.json", JSON.stringify(users));
}

let realPassword = process.env.PASSWORD.trim();

function verfPassword(password) {
    return password === realPassword;
}

function isAdmin(checkToken) {
    let current = Date.now();
    for(let { token, time } of admins) {
        if(checkToken === token && current - time < sevenDays) {
            return true;
        }
    }
    return false;
}

function isUser(checkToken) {
    for(let { token, time } of users) {
        if(token === checkToken && current - time < sevenDays)
            return true;
    }
    return false;
}

function getName(checkToken) {
    for(let { token, name } of users) {
        if(token === checkToken) return name;
    }
    return "";
}

function addUserToken(username, token) {
    users.push({ token, name: username, time: Date.now() });
    updateDatabases();
}

function addAdminToken(token) {
    admins.push({ token, time: Date.now() });
    updateDatabases();
}

module.exports = { isAdmin, isUser, verfPassword, getName, addUserToken, addAdminToken };