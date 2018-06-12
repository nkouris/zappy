zappy = require('./zappy');
aisurvive = require('./AI/survive');
const commands = [
    "avance",
    "droite",
    "gauche",
    "voir",
    "inventaire",
    "prend NULL",
    "pose NULL",
    "expluse",
    "broadcast huzaa",
    "incantation",
    "fork",
    "connect_nbr"
];

/* :>pickRndCommand:
    - Pick a RndCommand
    */
function pickRndCommand() {
    min = Math.ceil(0);
    max = Math.floor(12);
    return commands[Math.floor(Math.random() * (max - min)) + min];
}
function isInitDataFormat(buffer) {
    buffer = buffer.split('\n');
    console.log(buffer);
    if (buffer.length != 3)
        return false;
    console.log(parseInt(buffer[0]));
    if (parseInt(buffer[0]) <= 0)
        return false;
    buffer = buffer[1].split(" ");
    if (buffer.length != 2)
        return false;
    if ((zappy.$Z.mapWidth = parseInt(buffer[0])) <= 0)
        return false;
    if ((zappy.$Z.mapHeight = parseInt(buffer[1])) <= 0)
        return false;
    return true;
}

/* :> responseToServer:
    - Manages the proper response to the server upon a message (buffer).
*/
function responseToServer(buffer) {
    let response = "";
    console.log(buffer);
    if (buffer == "WELCOME\n" || buffer == "BIENVENUE\n")
        response = "team1\n";
    else if (isInitDataFormat(buffer)) {
        response = "voir" + '\n';
    } else
        response = aisurvive.response(buffer);
    return response;
}

/* :> reconnect:
    - Disconnects the socket if needed and then 
*/
function reconnect(socket, host, port) {
    socket.destroy();
    socket.connect({
        port: port,
        host: host
    });
}

module.exports.responseToServer = responseToServer;
module.exports.reconnect = reconnect;
module.exports.pickRndCommand = pickRndCommand;