let memory = require('./clientMem');
let manage = require('../manage');

function AILevelUpResponse(serverResponse){
    let response = "";
    serverResponse = serverResponse.split('\n');
    console.log(serverResponse);
    for(let i = 0; i < serverResponse.length; i++){
        if(serverResponse[i][0] == '{')    
            response += goToSquareWithFood(serverResponse[i]);
    }
    return response;
}

module.exports.response = AILevelUpResponse;