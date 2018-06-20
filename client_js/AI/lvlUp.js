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
    let incantNeedsSchema = levelUpSchema[memory.lvl].slice(1);
    for (let i = 1; i < memory.resourcesGuess.length; i++) {
        if (incantNeedsSchema[i] > memory.resourcesGuess[i])
            return i;
    }
    console.error("DONE COLLECTING");
    memory.inBroadcast = true;
    manage.fork_client();
}

function goToSquareWithNeededResources(serverResponse) {
    serverResponse = serverResponse.slice(1, serverResponse.length - 2);
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
    buffer = buffer.slice(1, buffer.length - 2);
    buffer = buffer.split(', ');
    let elem = null;
    let elemItemIndex = 0;
    for (let i = 0; i < buffer.length; i++) {
        elem = buffer[i].split(' ');
        if ((elemItemIndex = manage.items.indexOf(elem[0])) > 0)
            memory.resourcesGuess[elemItemIndex] = parseInt(elem[1]);
    }
}

function AILevelUpResponse(serverResponse) {
    let response = "";
    //Before this check if food has reached large value, like 50, keep checking if it needs food, food always above 50.
    if (memory.inBroadcast == true)
        return aisurvive.response(serverResponse);
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