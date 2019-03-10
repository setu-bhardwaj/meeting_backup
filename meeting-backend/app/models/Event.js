const mongoose = require('mongoose');
Schema = mongoose.Schema;

let eventSchema = new Schema({


    eventId:{
        type:String,
        unique:true,
        default:''
    },
    userId:{
        type:String,
        default:' '
    },
    title:{
        type:String,
        default:' '
    },
    description:{
        type:String,
        default:'no information provided'
    },
    startAt:{
        type:String,  
        default:new Date()
    },
    endAt:{
        type:String,
        default:new Date()
    },
    where:{
        type:String,
        default:'no info provided'
    },
    color:{
        type:String,
        default:'black'
    },
    createdAt:{
        type:String,
       default:new Date(),
    },
    createdBy:{
        type:String,
        default:'Admin'
    },
    lastModified:{
        type:String,
       default:new Date()
    }

})


module.exports = mongoose.model('Event', eventSchema)