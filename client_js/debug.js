'use strict';

/* Define the location of the console */
let debugConsole = document.getElementById('console');
let lineNum = 0;
/* Log Fx: 
    - Writes: logmsg to the innerHTML of the debugConsole.
*/
function log(who, logmsg){
    lineNum++;
    logmsg = logmsg.split("\n");
    debugConsole.innerHTML += lineNum + '| ' + who + '> ';
    for(let msg of logmsg){
        if(msg != ''){
            debugConsole.innerHTML += msg + "<br>";
        }
    }
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

function err(who, logmsg){
    lineNum++;
    debugConsole.innerHTML += '<span class="errormsg">' + lineNum + '| ' + who + '> ' + logmsg + "</span><br>";
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

module.exports.log = log;
module.exports.err = err;