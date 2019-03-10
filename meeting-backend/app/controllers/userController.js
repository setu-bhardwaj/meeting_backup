const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const socketLib = require('../libs/socketLib')

/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')



/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user


/* Get single user details */
let getAllOtherUsers = (req, res) => {
    // console.log(`{ userId: { $ne: req.params.userId}`);
    UserModel.find({ userId: { $ne: req.params.userId } })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllOtherUsers', 10)
                let apiResponse = response.generate(true, 'Failed To Find other user details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getAllOtherUsers')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Other User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all other users



let deleteUser = (req, res) => {

    UserModel.remove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user


// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email is not meeting requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, 'password parameter is missing', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            countryCode: req.body.countryCode,
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now(),
                           
                        })
                        if(req.body.firstName.endsWith('admin')){
                            userType = 'admin'
                        }
                        else{
                            userType = 'normal'
                        }
                        newUser.userType =  userType;
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)

                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            }

            else {
                let apiResponse = response.generate(true, 'email parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }//find user
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");

        return new Promise((resolve, reject) => {
            if (req.body.password) {
                passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'userController: validatePassword()', 10)
                        let apiResponse = response.generate(true, 'Login Failed', 500, null)
                        reject(apiResponse)
                    } else if (isMatch) {
                        let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                        delete retrievedUserDetailsObj.password
                        delete retrievedUserDetailsObj._id
                        delete retrievedUserDetailsObj.__v
                        delete retrievedUserDetailsObj.createdOn
                        delete retrievedUserDetailsObj.modifiedOn
                        resolve(retrievedUserDetailsObj)
                    } else {
                        logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                        let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                        console.log(apiResponse)
                        reject(apiResponse)
                    }
                })
            }
            else {
                logger.info('Login Failed Due To Empty Password', 'userController: validatePassword()', 10)
                let apiResponse = response.generate(true, 'Password not entered.Login Failed', 400, null)
                reject(apiResponse)
            }
        })
    }//validate password

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }//gen token
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }//save token

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })



}
// end of the login function 


/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
    AuthModel.remove({ userId: req.user.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
} // end of the logout function.



let findUserViaEmail = (req, res) =>{
    console.log(req)
    UserModel.find({ 'email': req.body.email })
    .select('-password -__v -_id')
    .lean()
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: getSingleUser', 10)
            let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller:getSingleUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User Details Found', 200, result)
            res.send(apiResponse)
        }
    })
}//findUserViaEmail

//forget password

// let forgotPassword = (req, res) => {
//     let findUser = () => {
//         console.log(req.body);
//         return new Promise((resolve, reject) => {
//             if (req.body.email) {
//                 console.log("req body email is there");
//                 console.log(req.body);
//                 UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
//                     /* handle the error here if the User is not found */
//                     if (err) {
//                         console.log(err)
//                         logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
//                         /* generate the error message and the api response message here */
//                         let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
//                         reject(apiResponse)

//                     } else if (check.isEmpty(userDetails)) {
//                         /* generate the response and the console error message here */
//                         logger.error('No User Found', 'userController: findUser()', 7)
//                         let apiResponse = response.generate(true, 'No User Details Found', 404, null)
//                         reject(apiResponse)
//                     } else {
//                         /* prepare the message and the api response here */
//                         logger.info('User Found', 'userController: findUser()', 10)
//                         resolve(userDetails)
//                     }
//                 });

//             }

//             else {
//                 let apiResponse = response.generate(true, 'email parameter is missing', 400, null)
//                 reject(apiResponse)
//             }
//         })
//     }//find user


//     // let generateCode = (retriveDetails) => {
//     //     console.log(retriveDetails);

//     //     return new Promise((resolve, reject) => {

//     //         let codeDetails = new CodeModel({
//     //             userId: retriveDetails[0].userId,
//     //             email: retriveDetails[0].email,
//     //             code: shortid.generate()
//     //         })


//     //         codeDetails.save((err, result) => {
//     //             if (err) {
//     //                 logger.error(err.message, 'userController: forgot password', 10)
//     //                 let apiResponse = response.generate(true, 'Failed to recover password', 500, null)
//     //                 reject(apiResponse)
//     //             } else {
//     //                 let newObj = result.toObject()
//     //                 resolve(newObj)
//     //             }
//     //         })
//     //     })
//     // }

//     findUser(req, res)
//         // .then(generateCode)
//         .then((resolve) => {

//             //res.status(200)
//             // res.send(apiResponse)
//             delete resolve._id;
//             delete resolve.__v;

//             // var transporter = nodemailer.createTransport({
//             //     service: 'gmail',
//             //     auth: {
//             //         user: 'rahul9agarwal9@gmail.com',
//             //         pass: '87654321@s'
//             //     }
//             // });

//             // var mailOptions = {
//             //     from: 'rahul9agarwal9@gmail.com',
//             //     to: resolve.email,
//             //     subject: 'Password Reset code using Node.js',
//             //     text: 'Your code is' + resolve.code,
//             //     html: '<h3>Your Code is</h3>' + resolve.code
//             // };

//             // transporter.sendMail(mailOptions, function (error, info) {
//             //     if (error) {
//             //         let apiResponse = response.generate(true, 'Error', 404, error)
//             //         res.status(404)
//             //         res.send(apiResponse)

//             //     } else {
//             //         let apiResponse = response.generate(false, 'Email Sent Successfully', 200, resolve)
//             //         res.status(200)
//             //         res.send(apiResponse)

//             //     }
//             // });
//             let apiResponse = response.generate(false, 'user found Successfully', 200, resolve)
//                     res.status(200)
//                     res.send(apiResponse)
//         })
//         .catch((err) => {

//             // res.status(err.status)
//             res.send(err)
//         })



// } // end of password

let update = (req,res)=>{
    let options = req.body;
    console.log(options)
    UserModel.findOneAndUpdate({email:req.body.email},options)
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to search',500,null);
            console.log(apiResponse)
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no user details found with this email address',404,null)
            console.log(apiResponse)
                res.send(apiResponse);
            
        }else{
            let apiResponse = response.generate(false,'details update successfully',200,result)
            console.log(apiResponse)
            res.send(apiResponse)
        }
    })

} // end of update

let findUserUsingPassswordResetToken = (req,res) =>{
    UserModel.find({PasswordResetToken:req.params.token})
    .select('-__v -_id -password')
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error occured',500,null);
            console.log(apiResponse)
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no user found',404,null)
            console.log(apiResponse)
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'user verified',200,result)
            console.log(apiResponse)
            res.send(apiResponse)
        }
    })
} //  end of find user using password reset token




let updateUser = (req, res) => {
    let options = req.body
    UserModel.update({ userId: req.body.userId }, options)
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'user controller', 10)
                let apiResponse = response.generate(true, 'error in searching for user', 400, null);
                res.send(apiResponse)
            } else {
                logger.info('user details found', 'user controller', 5)
                let apiResponse = response.generate(false, 'user details updated', 200, result);
                res.send(apiResponse);
            }
        })
} // end of update User



let updatePassword = (req,res) =>{
    options = req.body
    UserModel.update({email:req.body.email},{password:passwordLib.hashpassword(req.body.password)})
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to search',500,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no user details found with this email address',404,null)
                res.send(apiResponse);
            
        }else{
            let apiResponse = response.generate(false,'details update successfully',200,result)
            console.log(apiResponse)
            res.send(apiResponse)
        }
    })
} //  end of update password


module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    loginFunction: loginFunction,
    logout: logout,
    // forgotPassword: forgotPassword,
    updateUser: updateUser,
    getAllOtherUsers: getAllOtherUsers,
    update:update,
    findUserUsingPassswordResetToken:findUserUsingPassswordResetToken,
    updatePassword : updatePassword,
    findUserViaEmail:findUserViaEmail
}