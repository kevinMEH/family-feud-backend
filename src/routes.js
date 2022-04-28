const express = require("express");
const genToken = require("./token.js");
const { isAdmin, verfPassword, getName, addUserToken, addAdminToken } = require("./database.js");

const routes = express.Router();

let cookieOptions = { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, sameSite: "strict" };

let api = routes.route("/api");

let fiveSeconds = 1000 * 5;
let lastBuzz = 0;

let sockets = [];

routes.ws("/ws", (websocket, request) => {
    websocket.onmessage = message => {
        if(message.data == "Init")
            sockets.push(websocket);
    };
})

function buzzed(name) {
    for(let socket of sockets)
        socket.send(name);
}

api.post(async (request, response) => {
    let body = request.body;
    // Buzzing
    if(body.buzz !== undefined) {
        let now = Date.now();
        if(now - lastBuzz > fiveSeconds) {
            lastBuzz = now;
            let name = getName(request.cookies.token);
            buzzed(name);
            response.json({ success: true });
        } else {
            response.json({ success: false });
        }
    }
    // Requesting user token: success
    else if(body.username !== undefined) {
        let token = genToken();
        response.cookie("token", token, cookieOptions);
        response.json({ success: true });
        addUserToken(body.username, token);
    }
    // Requesting admin token: success
    else if(body.password !== undefined) {
        if(verfPassword(body.password)) {
            let token = genToken();
            response.cookie("token", token, cookieOptions);
            response.cookie("admin", "true", cookieOptions);
            response.json({ success: true });
            addAdminToken(token);
        } else {
            response.json({ success: false });
        }
    }
    // Requesting name: name
    else if(body.get === "name") {
        response.json({ name: getName(request.cookies.token) });
    }
    // Verifying admin token: success
    else if(body.get === "admin") {
        response.json({ success: isAdmin(request.cookies.token) });
    } else {
        response.status(400).send("Unrecognized payload.");
    }
})

module.exports = routes;