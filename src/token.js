const crypto = require("crypto");

function genToken() {
    const hash = crypto.createHash("sha256");
    let code = Date.now() * Math.random() + Math.random() + "";
    hash.update(code);
    return hash.digest("hex").substring(0, 16);
}

module.exports = genToken;