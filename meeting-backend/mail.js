const express = require('express');
const nodemailer = require('nodemailer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'rahul9agarwal9@gmail.com',
           pass: '87654321@s'
       }
   });


   let mailOptions = {
    from: 'rahul9agarwal9@gmail.com', // sender address
    to: 'setu123bh@gmail.com', // list of receivers
    subject: 'Subject test', // Subject line
    html: '<p>Hello dere</p>'// plain text body
  };


  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log("Message sent:" + info.response);
 });


// let info = await transporter.sendMail(mailOptions)

// console.log("Message sent: %s", info.messageId);
// // Preview only available when sending through an Ethereal account
// console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

// // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
// // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
