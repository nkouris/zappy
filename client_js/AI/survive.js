let memory = require('./clientMem');
let manage = require('../manage');
let aiLvlUp = require('./lvlUp');

function goToSquareWithFood(serverResponse) {
    serverResponse = serverResponse.slice(1, serverResponse.length - 2);
    serverResponse = serverResponse.split(', ');
    let items;
    for (let i = 0; i < serverResponse.length; i++) {
        items = serverResponse[i].split(' ');
        console.log(items);
        if (items.indexOf(manage.items[0]) > -1) {
            return memory.getCmdsfSquareNum(i) + manage.commands[5] + ' ' + manage.items[0] + '\n' + manage.commands[3] + '\n';
        }
    }
    return manage.commands[0] + "\n" + manage.commands[3] + "\n";
}

function AISurviveResponse(serverResponse) {
    let response = "";
    serverResponse = serverResponse.split('\n');
    console.log(serverResponse);
    let okRecieved = false;
    for (let i = 0; i < serverResponse.length; i++) {
        console.log(memory.okRecieved);
        if(serverResponse[i] == 'ok')
            memory.okRecieved--;
        if (serverResponse[i][0] == 'm' && memory.okRecieved <= 0) {
            if (memory.resourcesGuess[0] > 20) {
                memory.blockToGoTo = aiLvlUp.parseMessage(serverResponse[i]);
                if (memory.blockToGoTo >= 0) {
                    memory.goToLeader = true;
                    let goToBlock = aiLvlUp.goToHeardBlock(memory.blockToGoTo);
                    console.log("Going to: ", goToBlock);
                    memory.okRecieved = goToBlock[1];
                    return goToBlock[0];
                }
            }
        }
        else if (serverResponse[i][0] == '{') {
            if (aiLvlUp.isInventoryResponse(serverResponse[i])) {
                console.log("In here");
                aiLvlUp.setFromInventoryResponse(serverResponse[i]);
            } else {
                response += goToSquareWithFood(serverResponse[i]);
                response += manage.commands[4] + '\n';
            }
        }
    }
    return response;
}
// memory.getSquareTravelCoords()
module.exports.response = AISurviveResponse;