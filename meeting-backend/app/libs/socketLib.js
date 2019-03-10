
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
//const ChatModel = mongoose.model('Chat');

const nodeMailer = require('./nodemailerLib')

//const redisLib = require("./redisLib.js");


let alertEvent = {};

let setServer = (server) => {

    //let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {

        console.log("on connection");

        // socket.emit("verifyUser", "");

        // code to verify the user and make him online

        // socket.on('set-user', (authToken) => {

        //     console.log("set-user called")
        //     tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
        //         if (err) {
        //             socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
        //         }
        //         else {

        //             console.log("user is verified..setting details");
        //             let currentUser = user.data;
        //             // setting socket user id 
        //             socket.userId = currentUser.userId
        //             let fullName = `${currentUser.firstName} ${currentUser.lastName}`
        //             let key = currentUser.userId
        //             let value = fullName

        //             let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsers", key, value, (err, result) => {
        //                 if (err) {
        //                     console.log(`some error occurred`)
        //                 } else {
        //                     // getting online users list.

        //                     redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
        //                         console.log(`--- inside getAllUsersInAHas function ---`)
        //                         if (err) {
        //                             console.log(err)
        //                         } else {

        //                             console.log(`${fullName} is online`);
        //                             // setting room name
        //                             socket.room = 'edChat'
        //                             // joining chat-group room.
        //                             socket.join(socket.room)
        //                             socket.to(socket.room).broadcast.emit('online-user-list', result);


        //                         }
        //                     })
        //                 }
        //             })



        // // let userObj = {userId:currentUser.userId,fullName:fullName}
        // // allOnlineUsers.push(userObj)
        // // console.log(allOnlineUsers)




        //         }


        //     })

        // }) // end of listening set-user event

        socket.on('sendMail',(mailDetails)=>{
            console.log(mailDetails)
            nodeMailer.sendMail(mailDetails)
        }) //  end of send mail



        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);

        }) // end of on disconnect

        // var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
        // allOnlineUsers.splice(removeIndex, 1)
        // console.log(allOnlineUsers)

        // if (socket.userId) {
        //     redisLib.deleteUserFromHash('onlineUsers', socket.userId)
        //     redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
        //         if (err) {
        //             console.log(err)
        //         } else {
        //             socket.leave(socket.room)
        //             socket.to(socket.room).broadcast.emit('online-user-list', result);


        //         }
        //     })
        // }


     


     


    });







    // socket.on('chat-msg', (data) => {
    //     console.log("socket chat-msg called")
    //     console.log(data);
    //     data['chatId'] = shortid.generate()
    //     console.log(data);

    //     // event to save chat.
    //     setTimeout(function () {

    //         eventEmitter.emit('save-chat', data);

    //     }, 2000)
    //     myIo.emit(data.receiverId, data)

    // });

    // socket.on('typing', (fullName) => {

    //     socket.to(socket.room).broadcast.emit('typing', fullName);

    // });






}//set server


// database operations are kept outside of socket.io code.

// saving friend to database.

eventEmitter.on('save-event', (req, res) => {

    console.log('save-event', req);
    let newFriend = new Friend({
        id: shortid.generate(),
        requestedById: req.body.requestedById,
        requestedToId: req.body.requestedToId,
        requestedByName: req.body.requestedByName,
        requestedToName: req.body.requestedToName,
        status: req.body.status

    })

    newFriend.save((err, result) => {
        if (err) {
            logger.error(err.message, 'socket event: save friend', 10)
            let apiResponse = response.generate(true, 'Failed to save', 500, null)
            //res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'No Result Found', 404, null)
            console.log(apiResponse);

        } else {
            let apiResponse = response.generate(false, 'Friend Added successfully', 200, null)
            console.log(apiResponse);
        }
    })

})

eventEmitter.on('friendship', (req, res) => {

    let options = req
    Friend.update({ id: req.id }, options)
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'Failed to update friends', 500, null)
                //res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'No Result Found', 404, null)
                //res.send(apiResponse)
            } else {
                // console.log('result', result);
                let apiResponse = response.generate(false, 'Friends Details Updated Successfully', 200, result)
                //res.send(apiResponse)
                console.log('Added friend', apiResponse);
            }
        })
})
// eventEmitter.on('save-chat', (data) => {

//     // let today = Date.now();

//     let newChat = new ChatModel({

//         chatId: data.chatId,
//         senderName: data.senderName,
//         senderId: data.senderId,
//         receiverName: data.receiverName || '',
//         receiverId: data.receiverId || '',
//         message: data.message,
//         chatRoom: data.chatRoom || '',
//         createdOn: data.createdOn

//     });

//     newChat.save((err, result) => {
//         if (err) {
//             console.log(`error occurred: ${err}`);
//         }
//         else if (result == undefined || result == null || result == "") {
//             console.log("Chat Is Not Saved.");
//         }
//         else {
//             console.log("Chat Saved.");
//             console.log(result);
//         }
//     });

// }); // end of saving chat.

///redis code 


module.exports = {
    setServer: setServer
}
