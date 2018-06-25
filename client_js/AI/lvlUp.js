let memory = require('./clientMem');
let manage = require('../manage');
let aisurvive = require('./survive');
let levelUpSchema = [
    [1, 1, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 0, 0, 0],
    [2, 2, 0, 1, 0, 2, 0],
    [4, 1, 1, 2, 0, 1, 0],
    [4, 1, 2, 1, 3, 0, 0],
    [6, 1, 2, 3, 0, 1, 0],
    [6, 2, 2, 2, 2, 2, 1]
];

function itemThatsNeeded() {
    let incantNeedsSchema = levelUpSchema[memory.lvl - 1];
    for (let i = 1; i < memory.resourcesGuess.length; i++) {
        if (incantNeedsSchema[i] > memory.resourcesGuess[i])
            return i;
    }
    return -1;
}

function goToSquareWithNeededResources(serverResponse) {
    serverResponse = serverResponse.slice(1, serverResponse.length - 1);
    serverResponse = serverResponse.split(', ');
    let itemNeeded = itemThatsNeeded();
    let items;
    for (let i = 0; i < serverResponse.length; i++) {
        items = serverResponse[i].split(' ');
        console.log(items);
        if (items.indexOf(manage.items[itemNeeded]) > -1) {
            return memory.getCmdsfSquareNum(i) + manage.commands[5] + ' ' + manage.items[itemNeeded] + '\n' + manage.commands[3] + '\n';
        }
    }
    return manage.commands[0] + "\n" + manage.commands[3] + "\n" + manage.commands[4] + '\n';
}

function isInventoryResponse(buffer) {
    buffer = buffer.slice(1, buffer.length - 2);
    console.log(buffer);
    buffer = buffer.split(', ');
    let firstElem = buffer[0].split(' ');
    console.log(parseInt(firstElem[1]));
    if (isNaN(parseInt(firstElem[1])) || firstElem[1] == "" || firstElem[1] == undefined) {
        console.log("NOT INV");
        return false;
    }
    return true;
}
function setFromInventoryResponse(buffer) {
    buffer = buffer.slice(1, buffer.length - 1);
    buffer = buffer.split(', ');
    let elem = null;
    let elemItemIndex = 0;
    for (let i = 0; i < buffer.length; i++) {
        elem = buffer[i].split(' ');
        console.log(elem[0], "adding for inventory", parseInt(elem[1]));
        if ((elemItemIndex = manage.items.indexOf(elem[0])) >= 0)
            memory.resourcesGuess[elemItemIndex] = parseInt(elem[1]);
    }
}

function goToHeardBlock(squareNum) {
    console.log("Going to heard block...", squareNum);
    if (squareNum == 0)
        return [manage.commands[11] + '\n', 0];
    if (squareNum == 1)
        return [manage.advance, 1];
    else if (squareNum == 2)
        return [manage.advance + '' + manage.turnLeft + '' + manage.advance, 3];
    else if (squareNum == 3)
        return [manage.turnLeft + manage.advance, 2];
    else if (squareNum == 4)
        return [manage.turnLeft + '' + manage.advance + '' + manage.turnLeft + ' ' + manage.advance, 4];
    else if (squareNum == 5)
        return [manage.turnLeft + '' + manage.turnLeft + '' + manage.advance, 3];
    else if (squareNum == 6)
        return [manage.turnRight + '' + manage.advance + '' + manage.turnRight + '' + manage.advance, 4];
    else if (squareNum == 7)
        return [manage.turnRight + '' + manage.advance, 2];
    else if (squareNum == 8)
        return [manage.advance + '' + manage.turnRight + '' + manage.advance, 3];
    return ["", 0];
}

function parseMessage(serverResponse) {
    serverResponse = serverResponse.split(' ')[1].split(',');
    let squareToMoveTo = parseInt(serverResponse[0]);
    if (parseInt(serverResponse[1]) == memory.lvl) {
        if (parseInt(serverResponse[2]) == 0)
            return squareToMoveTo;
        else
            return 0;
    }
    return -1;
}

function ifBroadcast() {
    if (memory.broadcastDelay <= 0) {
        memory.broadcastDelay = 10;
        return manage.commands[8] + ' ' + memory.lvl + ',' + 0 + '\n';
    }
    memory.broadcastDelay--;
    if (memory.broadcastDelay % 2 == 0)
        return manage.commands[3] + '\n';
    return manage.commands[4] + '\n';
}

function howManyPlayersOnSquare(serverResponse) {
    let numPlayers = 0;
    serverResponse = serverResponse.slice(1, serverResponse.length - 2);
    serverResponse = serverResponse.split(', ');
    let contents = null;
    contents = serverResponse[0].split(' ');
    for (let j = 0; j < contents.length; j++)
        if (contents[j] == manage.playerLiteral)
            numPlayers++;
    console.log("PLAYERS:", numPlayers);
    return numPlayers;
}

function watchForIncantationEnd(serverResponse) {
    serverResponse = serverResponse.split('\n');
    for (let i = 0; i < serverResponse.length; i++) {
        if (serverResponse[i][0] == manage.finishIncant) {
            return parseInt(serverResponse[i].split(': ')[1]);
        }
    }
    return -1;
}

function dropAllItems() {
    let ret = "";
    for (let i = 1; i < memory.resourcesGuess.length; i++) {
        if (memory.resourcesGuess[i] > 0) {
            ret += manage.commands[6] + ' ' + manage.items[i] + '\n';
        }
    }
    return ret;
}
function AILevelUpResponse(serverResponse) {
    let response = "";
    let newLvl = -1;
    //Before this check if food has reached large value, like 50, keep checking if it needs food, food always above 50.
    // if (memory.inIncantation == true) {
    if ((newLvl = watchForIncantationEnd(serverResponse)) > -1) {
        memory.inBroadcast = false;
        memory.inIncantation = false;
        memory.doingBroadcast = false;
        memory.goToLeader = false;
        memory.hasForked = false;
        manage.fork_client();
        memory.lvl = newLvl;
        return manage.commands[3] + '\n';
    }
    console.log("NEW LVL", newLvl);
    if (memory.inIncantation == true) {
        console.warn("DOING INCANTATION");
        return "";
    }
    // }
    if (itemThatsNeeded() == -1) {
        memory.inBroadcast = true;
        if (memory.hasForked == false) {
            console.error("DONE COLLECTING FOR LEVEL");
            manage.fork_client();
            memory.hasForked = true;
            return manage.commands[10] + '\n';
        }
    }
    if (memory.inBroadcast == true && memory.inIncantation == false) {
        console.log("FOOODD", memory.resourcesGuess[0]);
        if (memory.resourcesGuess[0] > memory.lvl * 30 && memory.goToLeader == false) {
            memory.doingBroadcast = true;
            console.warn("DOING BROADCAST");
            serverResponse = serverResponse.split('\n');
            for (let i = 0; i < serverResponse.length; i++) {
                if (serverResponse[i][0] == "{") {
                    if (howManyPlayersOnSquare(serverResponse[i]) == levelUpSchema[memory.lvl - 1][0] - 1) {
                        memory.inIncantation = true;
                        return dropAllItems() + manage.commands[9] + '\n';
                    }
                }
            }
            return ifBroadcast();
        }
        else if (memory.inIncantation == false && (memory.goToLeader == true || memory.doingBroadcast == false || memory.resourcesGuess[0] <= 10)) {
            memory.doingBroadcast = false;
            return aisurvive.response(serverResponse);
        }
    }
    serverResponse = serverResponse.split('\n');
    console.log(serverResponse);
    for (let i = 0; i < serverResponse.length; i++) {
        if (serverResponse[i][0] == '{') {
            if (memory.inBroadcast == false && isInventoryResponse(serverResponse[i])) {
                console.log("In here");
                setFromInventoryResponse(serverResponse[i]);
            }
            else if (memory.inBroadcast == false && memory.inIncantation == false) {
                response += goToSquareWithNeededResources(serverResponse[i]);
            }
        }
    }
    return response;
}

module.exports.response = AILevelUpResponse;
module.exports.isInventoryResponse = isInventoryResponse;
module.exports.setFromInventoryResponse = setFromInventoryResponse;
module.exports.parseMessage = parseMessage;
module.exports.goToHeardBlock = goToHeardBlock;