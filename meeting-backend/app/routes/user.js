const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;
    //console.log(`${appConfig.apiVersion}/users`);

    // params: firstName, lastName, email, mobileNumber, password, apiKey.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
    * @api {post} /api/v1/users/signup Signup.
    * @apiVersion  1.0.0
    * @apiGroup Users
    * @apiParam {string} firstName firstName of the user. (body params) (required)
    * @apiParam {string} lastName lastName of the user. (body params) (required)
    * @apiParam {string} email email of the user. (body params) (required)
    * @apiParam {string} countryCode countryCode of the user. (body params) (required)
    * @apiParam {string} mobileNumber mobileNumber of the user. (body params) (required)
    * @apiParam {string} password password of the user. (body params) (required)
    * 
    * 
    * @apiSuccessExample {object} Success-Response:
       {
       "error": false,
       "message": "User created",
       "status": 200,
       "data": {
       "userId": "wQMNLE1JK",
       "firstName": "Happy",
       "lastName": "Singh",
       "email": "happy1@gmail.com",
       "countryCode": "+91",
       "mobileNumber": 7878787878,
       "createdOn": "2019-02-21T12:49:48.000Z"
       }
   }


   @apiErrorExample {json} Error-Response:
    *
    * {
       "error": true,
       "message": "One or More Parameter(s) is missing",
       "status": 400,
       "data

    
   */

    app.post(`${baseUrl}/login`, userController.loginFunction);


    /**
      * @apiGroup Users
      * @apiVersion  1.0.0
      * @api {post} /api/v1/users/login Login.
      *
      * @apiParam {string} email email of the user. (body params) (required)
      * @apiParam {string} password password of the user. (body params) (required)
      *
      * @apiSuccess {object} myResponse shows error status, message, http status code, result.
      * 
      * @apiSuccessExample {object} Success-Response:
          {
     "error": false,
     "message": "Login Successful",
     "status": 200,
     "data": {
         "authToken": eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjFDdGxfeWQ0ciIsImlhdCI6MTU1MDc1NDczMDM4OSwiZXhwIjoxNTUwODQxMTMwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IndRTU5MRTFKSyIsImZpcnN0TmFtZSI6IkhhcHB5IiwibGFzdE5hbWUiOiJTaW5naCIsImVtYWlsIjoiaGFwcHkxQGdtYWlsLmNvbSIsImNvdW50cnlDb2RlIjoiKzkxIiwibW9iaWxlTnVtYmVyIjo3ODc4Nzg3ODc4fX0.LM4bEVmJ72MPnx7zmldTPXjM7tcR__x9eS7iFxjElM0
         "userDetails": {
             "userId": "wQMNLE1JK",
             "firstName": "Happy",
             "lastName": "Singh",
             "email": "happy1@gmail.com",
             "countryCode": "+91",
             "mobileNumber": 7878787878
         }
     }
 }
     @apiErrorExample {json} Error-Response:
      *
      * {
     "error": true,
     "message": "Password not entered.Login Failed",
     "status": 400,
     "data": null
 }
 
     */

    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);

    /**
   
   
   * @api {post} /api/v1/users/logout  Logout
   * @apiVersion  1.0.0
   *  @apiGroup Users
   *
   * @apiParam {string} userId userId of the user. (auth headers) (required)
   * @apiParam {string} Authorization Authorization of the user. (body params) (required)  
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
  "error": false,
  "message": "Logged Out Successfully",
  "status": 200,
  "data": null
}


      @apiErrorExample {json} Error-Response:
   *
   * {
  "error": true,
  "message": "AuthorizationToken Is Missing In Request",
  "status": 400,
  "data": null
}

  */
 
 app.post(`${baseUrl}/findUser`, userController.findUserViaEmail);


    // app.post(`${baseUrl}/forgotPassword`, userController.forgotPassword);

    /**
     *  @api {post} /api/v1/users/forgotPassword Forgot Password
    * @apiVersion  1.0.0  
    * @apiGroup Users  
    * @apiParam {string} email email of the user.  (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
    
    * data: {}
           error: false
           message: "Friends Details Updated Successfully"
           status: 200

           data: {
               code: "so3hddyKr"
               email: "happy3@gmail.com.com"
               userId: "VqPBV2KU6"
               }
               error: false
               message: "Email Sent Successfully"
               status: 200

            

    * @apiErrorExample {json} Error-Response:
    *
    * {
   "error": true,
   "message": "No User Found",
   "status": 404,
   "data": null
}
   */


    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUser);


    /**
    * @apiGroup UserDetails
    * @apiVersion  1.0.0
    * @api {get} /api/v1/users/view/all Get all user details.
    *
    * @apiParam {string} userId userId of the user. (params) (required)
    * @apiParam {string} Authorization Authorization of the user. (header params) (required)  
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
   "error": false,
   "message": "All User Details Found",
   "status": 200,
   "data": [
       {
           "userId": "gcHB6b649",
           "firstName": "Rahul",
           "lastName": "Agarwal",
           "password": "$2b$10$0AmiwGEAdh6TPouCNWGdVunF7oigtDZKMjicGNGPUDp91.IsvcAsi",
           "email": "rahul1211@gmail.com",
           "countryCode": "91",
           "mobileNumber": 0,
           "createdOn": "2019-02-19T18:38:25.000Z"
       },
       {
           "userId": "wQMNLE1JK",
           "firstName": "Happy",
           "lastName": "Singh",
           "password": "$2b$10$lVqT9MxwiAmOjbvzVGeD6.OcU.ErzEasrd7U2QX1WnBcNV8ZBhpWO",
           "email": "happy1@gmail.com",
           "countryCode": "+91",
           "mobileNumber": 7878787878,
           "createdOn": "2019-02-21T12:49:48.000Z"
       }
   ]
}

    * @apiErrorExample {json} Error-Response:
    *
    * 
Error:
{
   "error": true,
   "message": "AuthorizationToken Is Missing In Request",
   "status": 400,
   "data": null
}

   */

    // getting single user info
    app.get(`${baseUrl}/:userId/userDetails`, auth.isAuthorized, userController.getSingleUser);


    /**
    * @apiGroup UserDetails
    * @apiVersion  1.0.0
    * @api {get} /api/v1/users/userId/userDetails Get Single user details.
    *
    * @apiParam {string} userId userId of the user. (params) (required)
    * @apiParam {string} Authorization Authorization of the user. (header params) (required)  
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
   "error": false,
   "message": "User Details Found",
   "status": 200,
   "data": {
       "userId": "wQMNLE1JK",
       "firstName": "Happy",
       "lastName": "Singh",
       "email": "happy1@gmail.com",
       "countryCode": "+91",
       "mobileNumber": 7878787878,
       "createdOn": "2019-02-21T12:49:48.000Z"
   }
}


    * @apiErrorExample {json} Error-Response:
    *
    * 
Error:
{
   "error": true,
   "message": "No User Found",
   "status": 404,
   "data": null
}


   */

    //getting all other users apart from current user id
    app.get(`${baseUrl}/:userId/all`, auth.isAuthorized, userController.getAllOtherUsers);

    /**
     * @apiGroup UserDetails
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/userId/all Get all Other User details.
     *
     * @apiParam {string} userId userId of the user. (params) (required)
     * @apiParam {string} Authorization Authorization of the user. (header params) (required)  
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "All Other User Details Found",
    "status": 200,
    "data": [
        {
            "userId": "2Z9hEoiFD",
            "firstName": "Rahul",
            "lastName": "Agarwal",
            "email": "rahul1213@gmail.com",
            "mobileNumber": 0,
            "createdOn": "2019-02-18T14:21:30.000Z"
        }


     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No User Found",
	    "status": 400,
	    "data": null
	   }
    */


   


    app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);

    /**
     * @apiGroup UserDetails
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/userId/edit Editing the User details.
     *
     * @apiParam {string} userId userId of the user. (params) (required)
     * @apiParam {string} Authorization Authorization of the user. (header params) (required)  
     *   @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
	 * @apiParam {string} countryCode countryCode of the user. (body params) (required)
     * @apiParam {string} mobileNumber mobileNumber of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "User details edited",
    "status": 200,
    "data": {
        "userId": "wQMNLE1JK",
        "firstName": "Happy",
        "lastName": "Singh",
        "email": "happy1@gmail.com",
        "countryCode": "+91",
        "mobileNumber": 7878787878,
        "createdOn": "2019-02-21T12:49:48.000Z",
    }
  }


     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No User Found",
	    "status": 400,
	    "data": null
	   }
    */


    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);

    /**
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @api {get} /api/v1/users/userId/delete Delete .
   *
   * @apiParam {string} userId userId of the user. (params) (required)
   * @apiParam {string} Authorization Authorization of the user. (header params) (required)  
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
       {
  "error": false,
  "message": "Deleted the user successfully",
  "status": 200,
  "data": {
      "n": 1,
      "ok": 1
  }



   * @apiErrorExample {json} Error-Response:
   *
   * {
      "error": true,
      "message": "No User Found",
      "status": 400,
      "data": null
     }
  */


    //  app.post(`${baseUrl}/update`,userController.updateUser);


    app.get(`${baseUrl}/verify/:token`,userController.findUserUsingPassswordResetToken)

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get}/api/v1/users//verify/:token api to get a user details using password reset token.
     * @apiParam {string} password reset token. (URL params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user details found",
    "status": 200,
    "data": {
        "userId": "QTWguvRkA",
        "userType": "admin",
        "firstName": "test",
        "lastName": "Admin",
        "email": "test-admin@gmail.com",
        "countryCode": 91,
        "mobileNumber": 123,
        "createdOn": "2018-08-03T14:37:13.000Z",
        "PasswordResetToken": "pd-vRnsjy",
        "PasswordResetExpiration": "2018-08-03T18:25:24.841Z"
    }
}    */

app.post(`${baseUrl}/update`,userController.update)
app.post(`${baseUrl}/updatePassword`,userController.updatePassword)



}

module.exports = {
    setRouter: setRouter
}
