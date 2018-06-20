zappy = require('./zappy');
aisurvive = require('./AI/survive');
aiLvlUp = require('./AI/lvlUp');
const { spawn } = require('child_process');
var remote = require('electron').remote,
    args = remote.getGlobal('sharedObject').prop1;
const commands = [
    "avance",
    "droite",
    "gauche",
    "voir",
    "inventaire",
    "prend",
    "pose",
    "expluse",
    "broadcast huzaa",
    "incantation",
    "fork",
    "connect_nbr"
];

const commands_fr = [
    "advance",
    "right",
    "left",
    "see",
    "inventory",
    "take",
    "put",
    "kick",
    "broadcast huzaa",
    "incantation",
    "fork",
    "connect_nbr"
];

const items_fr = [
    "food",
    "linemate",
    "deraumere",
    "sibur",
    "mendiane",
    "phiras",
    "thystame"
]
const items = [
    "nourriture",
    "linemate",
    "deraumere",
    "sibur",
    "mendiane",
    "phiras",
    "thystame"
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
function fork_client() {
    const ls = spawn('./client.sh', ['-n', args[2], '-p', args[3], '-h', args[4]],{
        stdio: 'ignore'
      });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
let hasSeen = false;
function responseToServer(buffer) {
    let response = "";
    console.log(buffer);
    if (buffer == "WELCOME\n" || buffer == "BIENVENUE\n")
        response = args[2] + "\n";
    else if (hasSeen == false && isInitDataFormat(buffer)) {
        response = commands[3] + '\n' + commands[10] + '\n' + commands[4] + '\n';
        // fork_client_exponentially();
        hasSeen = true;
    } else
        response = aiLvlUp.response(buffer);
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
module.exports.commands = commands;
module.exports.items = items;
module.exports.fork_client = fork_client;