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
const EventModel = mongoose.model('Event');


let addEvent = (req, res) => {

    if (!req.body) {
        let apiResponse = response.generate(true, 'no information been passed', 500, null);
        res.send(apiResponse)
    } else {
        var today = Date.now()
        let newEvent = new EventModel({

            eventId: shortId.generate(),
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
            where: req.body.where,
            color: req.body.color,
            createdAt: today,
            createdBy: req.body.createdBy,
            lastModified :req.body.lastModified

        })

        newEvent.save((err, result) => {
            delete result.__v
            delete result._id
            if (err) {

                let apiResponse = response.generate(true, 'error occured while saving the event', 500, null);
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

                let apiResponse = response.generate(true, 'no result found', 404, null);
                res.send(apiResponse)

            } else {

                delete result.__v
                delete result._id
                let apiResponse = response.generate(false, 'event has been added successfully', 200, result)
                res.send(apiResponse)
            }

        })//new event save

    }
}//addEvent
   


let getAllEventsOfUser = (req,res) =>{

    EventModel.find({userId:req.params.userId})
        .select('-__v -_id -eventId -userId -color')
        .lean()
        .exec((err,result)=>{
            if(err){
                let apiResponse=response.generate(true,'error occured in finding event',500,null);
                res.send(apiResponse)
            }else if(check.isEmpty(result)){
                let apiResponse=response.generate(true,'user event not found',404,null);
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false,'all user events found',200,result);
                res.send(apiResponse)
            }
        })
} //getAllEvents of user

let getSingleEvent = (req,res) =>{


    EventModel.find({eventId:req.params.eventId})
    .lean()
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error occured in finding',500,null)
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no events found',404,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'event found successfully',200,result)
            res.send(apiResponse);
        }
    })
    
    }// get single event

let getAllEventsByDate = (req,res) =>{


    EventModel.find({  $or:[ {userId:req.body.userId,startAt:new Date(req.body.startAt)} , {userId:req.body.userId,endAt:new Date(req.body.endAt)} ]   })
    .lean()
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error occured in finding',500,null)
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no events found',404,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'all details found successfully',200,result)
            res.send(apiResponse);
        }
    })
    
    }// get all events by date

    let editEvent = (req,res) =>{
        let options = req.body
        EventModel.update({eventId:req.params.eventId}, options, { multi: true })
        .exec((err,result)=>{
            if(err){
                let apiResponse = response.generate(true,'error occured in updating',500,null)
                res.send(apiResponse);
            }else if(check.isEmpty(result)){
                let apiResponse = response.generate(true,'No event Found',null);
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false,'Event successfully updated',200,result)
                res.send(apiResponse);
            }
    
        })
    } //edit event
    
    let deleteEvent = (req,res)=>{
    
        EventModel.remove({eventId:req.params.eventId})
        .exec((err,result)=>{
            if(err){
                let apiResponse = response.generate(true,'error while deleting',500,null);
                res.send(apiResponse);
            }else if(check.isEmpty(result)){
                let apiResponse = response.generate(true,'No event found',404, null);
                res.send(apiResponse);
            }else{
                let apiResponse = response.generate(false,'event deleted successfully',200,result);
                res.send(apiResponse);
            }       
    
        })
    }
    

   module.exports = {
    addEvent:addEvent,
    getAllEventsOfUser:getAllEventsOfUser,
    getSingleEvent:getSingleEvent,
    getAllEventsByDate:getAllEventsByDate,
    editEvent:editEvent,
    deleteEvent:deleteEvent
}