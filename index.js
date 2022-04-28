require("dotenv").config({ path: "./config.env"});
const cookieParser = require("cookie-parser");
const cors = require("cors");

const express = require("express");

const app = express();
require("express-ws")(app);

const routes = require("./src/routes.js");

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(routes);

app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send("Server Unavailable")
});

app.listen(3001, () => console.log("Server running on 3001."));