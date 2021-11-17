const moment = require('moment');

function formatmessage(username,text){
    return {
        username,
        text,
        time: moment().format('h:m:a')
    }
}
module.exports = formatmessage