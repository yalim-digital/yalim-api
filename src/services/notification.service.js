const socket = require('../sockets/reunion.socket');

const notifyAdmins = (
    event,
    data
) => {

    socket
        .getIO()
        .to('admin_room')
        .emit(event, data);

};

const notifyMember = (
    memberId,
    event,
    data
) => {

    socket
        .getIO()
        .to(`member_${memberId}`)
        .emit(event, data);

};

module.exports = {
    notifyAdmins,
    notifyMember
};