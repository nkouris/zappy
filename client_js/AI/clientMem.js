let manage = require('../manage');
function getSquareTravelCoords(squareNum) {
    let squaresToMoveForward = Math.floor(Math.sqrt(squareNum));
    let lateralMovement = squareNum -
        ((Math.pow(squaresToMoveForward, 2)) + squaresToMoveForward);
    return [squaresToMoveForward, lateralMovement];
}

function getCmdsfSquareNum(squareNum) {
    let cmds = "";
    let dir = manage.commands[1];
    let travelCoord = getSquareTravelCoords(squareNum);
    for (let i = 0; i < travelCoord[0]; i++) {
        cmds += manage.commands[0] + '\n';
    }
    if (travelCoord[1] < 0)
        dir = manage.commands[2];
    for (let i = 0; i < Math.abs(travelCoord[1]); i++)
        cmds += dir + '\n' + manage.commands[0] + '\n';
    return cmds;
}

module.exports = {
    lvl: 1,
    inIncantation: false,
    inBroadcast: false,
    doingBroadcast: false,
    goToLeader: false,
    resourcesGuess: [0,0,0,0,0,0,0],
    getSquareTravelCoords: getSquareTravelCoords,
    AIType: "Survive",
    isLeader: false,
    blockToGoTo: -1,
    getCmdsfSquareNum: getCmdsfSquareNum,
    hasForked: false,
    okRecieved: false,
    broadcastDelay: 0,
}