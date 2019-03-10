const express = require('express');
const nodemailer = require('nodemailer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let result = false;
let sendMail =  (mailDetails) =>{
    
    nodemailer.createTestAccount((err, account) => {
        
        let transporter = nodemailer.createTransport({
            service:"Gmail",
            auth: {
                user: 'rahul9agarwal9@gmail.com', // generated ethereal user
                pass: '87654321@s@2016' // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'rahul9agarwal9@gmail.com', // sender address
            to: mailDetails.receiver, // list of receivers
            subject: mailDetails.subject, // Subject line
            // text: mailDetails.text, // plain text body
            html: mailDetails.html // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
    
            if(error){
                result = false;
            }else{
                result =  true;;
            }
    
            // Preview only available when sending through an Ethereal account
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    

    
        });
    
        
    
    });
    
    return result;
    
    }
    
    
    module.exports = {
        sendMail:sendMail
    }


// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//            user: 'rahul9agarwal9@gmail.com',
//            pass: '87654321@s'
//        }
//    });


//    let mailOptions = {
//     from: 'rahul9agarwal9@gmail.com', // sender address
//     to: 'setu123bh@gmail.com', // list of receivers
//     subject: 'Subject test', // Subject line
//     html: '<p>Hello dere</p>'// plain text body
//   };


//   transporter.sendMail(mailOptions, function (err, info) {
//     if(err)
//       console.log(err)
//     else
//       console.log("Message sent:" + info.response);
//  });


// let info = await transporter.sendMail(mailOptions)

// console.log("Message sent: %s", info.messageId);
// // Preview only available when sending through an Ethereal account
// console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

// // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
// // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
