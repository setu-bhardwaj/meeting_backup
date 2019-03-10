// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken')
// const shortid = require('shortid')

// const UserModel = mongoose.model('User')

// let usePasswordHashToMakeToken = ({
//     password: passwordHash,
//     _id: userId,
//     createdAt
//   }) => {
//     const secret = passwordHash + "-" + createdAt
//     const token = jwt.sign({ userId }, secret, {
//       expiresIn: 3600 // 1 hour
//     })
//     return token
//   }

//   let sendPasswordResetEmail =  (req, res) => {
//     let { email } = req.params
//     let user
//     try {
//       user = UserModel.findOne({ email }).exec()
//     } catch (err) {
//       res.status(404).json("No user with that email")
//     }
//     const token = usePasswordHashToMakeToken(user)
//     const url = getPasswordResetURL(user, token)
//     const emailTemplate = resetPasswordTemplate(user, url)
  
//     let sendEmail = () => {
//       transporter.sendMail(emailTemplate, (err, info) => {
//         if (err) {
//           res.status(500).json("Error sending email")
//         }
//         console.log(`Email sent successfully`, info.response)
//       })
//     }
//     sendEmail()
//   }


//   let receiveNewPassword = (req, res) => {
//     const { userId, token } = req.params
//     const { password } = req.body
  
//     User.findOne({ _id: userId })
  
//       .then(user => {
//         const secret = user.password + "-" + user.createdAt
//         const payload = jwt.decode(token, secret)
//         if (payload.userId === user.id) {
//           bcrypt.genSalt(10, function(err, salt) {
//             if (err) return
//             bcrypt.hash(password, salt, function(err, hash) {
//               if (err) return
//               User.findOneAndUpdate({ _id: userId }, { password: hash })
//                 .then(() => res.status(202).json("Password changed accepted"))
//                 .catch(err => res.status(500).json(err))
//             })
//           })
//         }
//       })
  
//       .catch(() => {
//         res.status(404).json("Invalid user")
//       })
//   }
  
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_LOGIN,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   })

  
//   let getPasswordResetURL = (user, token) =>
//   `http://localhost:3000/password/reset/${user._id}/${token}`

// let resetPasswordTemplate = (user, url) => {
//   const from = process.env.EMAIL_LOGIN
//   const to = user.email
//   const subject = "Password Reset "
//   const html = `
//   <p>Hey ${user.firstName || user.email},</p>
//   <p>You can use the following link to reset your password:</p>
//   <a href=${url}>${url}</a>
//   <p>If you don’t use this link within 1 hour, it will expire.</p>
//   `

//   return { from, to, subject, html }
// }
