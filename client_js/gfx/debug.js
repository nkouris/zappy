'use strict';

/* Define the location of the console */
let debugConsole = document.getElementById('console');
/* Log Fx: 
    - Writes: logmsg to the innerHTML of the debugConsole.
*/
function log(who, logmsg){
    console.log(who, ": ", logmsg);
}

function err(who, logmsg){
console.error(who, ": ", logmsg);
}

module.exports.log = log;
module.exports.err = err;