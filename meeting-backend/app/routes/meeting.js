const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth');
const meetingController = require('./../controllers/meetingController');



let setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/meeting`;

    //add
    app.post(`${baseUrl}/addEvent`,auth.isAuthorized,meetingController.addEvent)

    //get
    app.get(`${baseUrl}/getEvents/user/:userId`,auth.isAuthorized,meetingController.getAllEventsOfUser)

    app.get(`${baseUrl}/getEvents/event/:eventId`,auth.isAuthorized,meetingController.getSingleEvent)

    app.get(`${baseUrl}/getEvents/date/byDate`,auth.isAuthorized,meetingController.getAllEventsByDate)

    //edit

    app.put(`${baseUrl}/editEvent/:eventId`,auth.isAuthorized,meetingController.editEvent)

    //delete
    app.post(`${baseUrl}/deleteEvent/:eventId`,auth.isAuthorized,meetingController.deleteEvent);




}//setRouter





module.exports = {
    setRouter:setRouter
}
