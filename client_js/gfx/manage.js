zappy = require('./zappy');
gfx = require('./gfx');
player = require('./player');
const commands = {
    "msz": isMapSize,
    "sgt": isSetTimeInterval,
    "tna": isTeamName,
    "pnw": isNewPlayerConnect,
    "ppo": isPlayerPositionUpdate,
    "pdi": isPlayerDead,

};
// /* :>pickRndCommand:
//     - Pick a RndCommand
//     */
// function pickRndCommand() {
//     min = Math.ceil(0);
//     max = Math.floor(12);
//     return commands[Math.floor(Math.random() * (max - min)) + min];
// }
// function isInitDataFormat(buffer) {
//     buffer = buffer.split('\n');
//     console.log(buffer);
//     if (buffer.length != 3)
//         return false;
//     console.log(parseInt(buffer[0]));
//     if (parseInt(buffer[0]) <= 0)
//         return false;
//     buffer = buffer[1].split(" ");
//     if (buffer.length != 2)
//         return false;
//     if ((zappy.$Z.mapWidth = parseInt(buffer[0])) <= 0)
//         return false;
//     if ((zappy.$Z.mapHeight = parseInt(buffer[1])) <= 0)
//         return false;
//     return true;
// }

/* :> responseToServer:
    - Manages the proper response to the server upon a message (buffer).
*/
function responseToServer(buffer) {
    let response = "";
    let cmdKeyWord = buffer.slice(0, 3);
    let whatToDo = null;
    if (buffer == "WELCOME" || buffer == "BIENVENUE")
        response = "GRAPHIC\n";
    else {
        if ((whatToDo = commands[cmdKeyWord]) == undefined)
            return response;
        whatToDo(buffer);
    }
    return response;
}

// /* :> reconnect:
//     - Disconnects the socket if needed and then 
// */
// function reconnect(socket, host, port) {
//     socket.destroy();
//     socket.connect({
//         port: port,
//         host: host
//     });
// }
function isMapSize(buffer) {
    console.warn("----In Map Size----")
    buffer = buffer.split(' ');
    gfx.config.mapWidth = parseInt(buffer[1]);
    gfx.config.mapHeight = parseInt(buffer[2]);
    gfx.init();
    gfx.animate();
}

function isSetTimeInterval(buffer) {
    console.warn("----In Set Time Interval----")
    buffer = buffer.split(' ');
    gfx.config.timeInterval = parseInt(buffer[1]);
}

function isTeamName(buffer) {
    console.warn("----In Team Name----")
    buffer = buffer.split(' ');
    gfx.config.teams[buffer[1]] = '0x'+Math.floor(Math.random()*16777215).toString(16);;
}

function isNewPlayerConnect(buffer) {
    console.warn("----In New Player Connected----")
    buffer = buffer.split(' ');
    let playerId = parseInt(buffer[1]);
    gfx.config.players[playerId] = new player.class({
        x: parseInt(buffer[2]),
        y: parseInt(buffer[3]),
        orientation: parseInt(buffer[4]),
        lvl: parseInt(buffer[5]),
        team: buffer[6],
        id: playerId,
        model: gfx.config.modelChap.clone()
    });
    gfx.config.players[playerId].model.children[0].material.color.setHex(gfx.config.teams[gfx.config.players[playerId].team]);
    gfx.config.players[playerId].model.children[1].material.color.setHex(gfx.config.teams[gfx.config.players[playerId].team]);
    gfx.scene.add(gfx.config.players[playerId].model);
}

function isPlayerPositionUpdate(buffer) {
    console.warn("----In Player Position Updated----")
    buffer = buffer.split(' ');
    let playerId = parseInt(buffer[1]);
    if (gfx.config.players[playerId] == undefined)
        return;
    gfx.config.players[playerId].target.x = parseInt(buffer[2]);
    gfx.config.players[playerId].target.y = parseInt(buffer[3]);
    gfx.config.players[playerId].orientation = parseInt(buffer[4]);
}

function isPlayerDead(buffer) {
    console.warn("----In Player Dead----")
    buffer = buffer.split(' ');
    let playerId = parseInt(buffer[1]);
    if (gfx.config.players[playerId] == undefined)
    return;
    
    gfx.scene.remove(gfx.config.players[playerId].model);
    delete gfx.config.players[playerId];
}
module.exports.responseToServer = responseToServer;
// module.exports.reconnect = reconnect;
// module.exports.pickRndCommand = pickRndCommand;