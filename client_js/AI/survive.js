let memory = require('./clientMem');
let manage = require('../manage');

function goToSquareWithFood(serverResponse){
    serverResponse = serverResponse.slice(1, serverResponse.length - 2);
    serverResponse = serverResponse.split(', ');
    let items;
    for(let i = 0; i < serverResponse.length; i++){
        items = serverResponse[i].split(' '); 
        if(items.indexOf("nourriture") > -1){
            return memory.getCmdsfSquareNum(i) + "prend nourriture\n" + "voir\n";
        }
    }
    return "avance\nvoir\n";
}
function AISurviveResponse(serverResponse){
    let response = "";
    serverResponse = serverResponse.split('\n');
    console.log(serverResponse);
    for(let i = 0; i < serverResponse.length; i++){
        if(serverResponse[i][0] == '{')    
            response += goToSquareWithFood(serverResponse[i]);
    }
    return response;
}
// memory.getSquareTravelCoords()
module.exports.response = AISurviveResponse;