zappy = require('./zappy');
gfx = require('./gfx');
player = require('./player');
resources = require('./resources');
const commands = {
    "msz": isMapSize,
    "sgt": isSetTimeInterval,
    "tna": isTeamName,
    "pnw": isNewPlayerConnect,
    "ppo": isPlayerPositionUpdate,
    "pdi": isPlayerDead,
    "bct": isBoardData,
    "pin": isPlayerInventory,
    "plv": isPlayerLevel,
    "pic": isStartIncantation,
    "pbc": isBroadcast,
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
    // console.log("FROM SERVER");
    // console.warn(buffer);
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
    gfx.config.teams[buffer[1]] = '0x' + Math.floor(Math.random() * 16777215).toString(16);
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
    gfx.config.players[playerId].model.children[0].name = "chappie";
    gfx.config.players[playerId].model.children[1].name = "chappie";
    gfx.config.players[playerId].model.children[0].playerId = playerId;
    gfx.config.players[playerId].model.children[1].playerId = playerId;
    gfx.config.players[playerId].model.children[0].material = gfx.config.modelChap.children[0].material.clone();
    gfx.config.players[playerId].model.children[1].material = gfx.config.modelChap.children[1].material.clone();
    gfx.config.players[playerId].model.children[0].material.color.setHex(gfx.config.teams[gfx.config.players[playerId].team]);
    gfx.config.players[playerId].model.children[1].material.color.setHex(gfx.config.teams[gfx.config.players[playerId].team]);
    gfx.config.players[playerId].model.children[0].callback = function () {
        gfx.config.players[playerId].model.children[0].material.color.setHex("0xFFFFFF");
        gfx.config.players[playerId].model.children[1].material.color.setHex("0xFFFFFF");
        gfx.config.players[playerId].model.children[0].material.wireframe = true;
        gfx.config.players[playerId].model.children[1].material.wireframe = true;
    }
    gfx.config.players[playerId].model.children[1].callback = function () {
        gfx.config.players[playerId].model.children[0].material.wireframe = true;
        gfx.config.players[playerId].model.children[1].material.wireframe = true;
        gfx.config.players[playerId].model.children[0].material.color.setHex("0xFFFFFF");
        gfx.config.players[playerId].model.children[1].material.color.setHex("0xFFFFFF");
    }
    gfx.config.players[playerId].model.name = "chappie";
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

function isBoardData(buffer) {
    console.warn("----In Board Data----")
    buffer = buffer.split(' ');
    let x = parseInt(buffer[1]);
    let y = parseInt(buffer[2]);
    let quantities = [parseInt(buffer[3]), parseInt(buffer[4]), parseInt(buffer[5]), parseInt(buffer[6]), parseInt(buffer[7]), parseInt(buffer[8]), parseInt(buffer[9])];
    if (resources.board[x] == undefined)
        resources.board[x] = [];
    if (resources.board[x][y] == undefined) {
        resources.board[x][y] = {};
        resources.board[x][y].meshes = [];
        resources.board[x][y].quantities = [];
        let geometry = null;
        let material = null;
        let cube = null;
        for (let i = 0; i < 7; i++) {
            geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 1);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(parseInt(resources.colors[i])) });
            cube = new THREE.Mesh(geometry, material);
            resources.board[x][y].meshes.push(cube);
            if (i < 4)
                gfx.setPositionOnGrid(cube, x + 0.7, y + 1 + i / 20, 1);
            else
                gfx.setPositionOnGrid(cube, x + 1, y + 1 + (i - 4) / 20, 1);
            gfx.scene.add(cube);
        }
    }
    /*Update the cube heights here*/
    for (let i = 0; i < 7; i++) {
        resources.board[x][y].quantities[i] = quantities[i];
        if (quantities[i] == 0)
            gfx.scene.remove(resources.board[x][y].meshes[i]);
        else {
            resources.board[x][y].meshes[i].scale.set(1, 1, quantities[i] / 2);
            gfx.scene.add(resources.board[x][y].meshes[i]);
        }
    }
}

function isPlayerInventory(buffer) {
    console.warn("----In Player Inventory----");
    buffer = buffer.split(' ');
    let playerId = parseInt(buffer[1]);
    gfx.config.players[playerId].inventory = [parseInt(buffer[4]), parseInt(buffer[5]), parseInt(buffer[6]), parseInt(buffer[7]), parseInt(buffer[8]), parseInt(buffer[9]), parseInt(buffer[10])];
}

function isPlayerLevel(buffer) {
    console.warn("---In Player Lvl---");
    buffer = buffer.split(' ');
    let playerId = parseInt(buffer[1]);
    gfx.config.players[playerId].lvl = parseInt(buffer[2]);
}

function isStartIncantation(buffer) {
    console.warn("---In Start Incantation---");
}

function isBroadcast(buffer) {
    buffer = buffer.split(' ');
    let playerId = parseInt(buffer[1]);
    let player = gfx.config.players[playerId];
    player.inBroadcast = new Date();
    var geometry = new THREE.TorusBufferGeometry(1, 0.1, 2, 15);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var torus = new THREE.Mesh(geometry, material);
    if (gfx.config.players[playerId].broadcastTorus != undefined)
        gfx.scene.remove(player.broadcastTorus);
    setPositionOnGrid(torus, player.loc.x + 1, player.loc.y + 1);
    gfx.scene.add(torus);
    gfx.config.players[playerId].broadcastTorus = torus;
}
module.exports.responseToServer = responseToServer;
// module.exports.reconnect = reconnect;
// module.exports.pickRndCommand = pickRndCommand;