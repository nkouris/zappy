function getSquareTravelCoords(squareNum) {
    let squaresToMoveForward = Math.floor(Math.sqrt(squareNum));
    let lateralMovement = squareNum -
        ((Math.pow(squaresToMoveForward, 2)) + squaresToMoveForward);
    return [squaresToMoveForward, lateralMovement];
}

function getCmdsfSquareNum(squareNum) {
    let cmds = "";
    let dir = "droite";
    let travelCoord = getSquareTravelCoords(squareNum);
    for (let i = 0; i < travelCoord[0]; i++) {
        cmds += 'avance\n';
    }
    if (travelCoord[1] < 0)
        dir = "gauche";
    for (let i = 0; i < Math.abs(travelCoord[1]); i++)
        cmds += dir + '\navance\n';
    return cmds;
}

module.exports = {
    lvl: 1,
    getSquareTravelCoords: getSquareTravelCoords,
    AIType: "Survive",
    getCmdsfSquareNum: getCmdsfSquareNum
}