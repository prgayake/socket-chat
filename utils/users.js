const users =[]

function userJoin(id,username,room){
    const user = {id ,username, room}
    users.push(user);
    return user;
}   

function userLeave(id){

    const user = users.find(user =>user.id === id); 
    var index = users.indexOf(user);
    if (index !== -1) {
        users.splice(index, 1); 
    }
    return user;
}

function getRoomUsers(room){
    return users.filter(user => user.room ===room);
}

function getCurrentUser(id){
    return users.find(user =>user.id === id); 
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}