const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')


const Code = new Schema({
  userId: {
    type: String
  },
  email: {
    type: String
  },
  code: {
    type: String
  },
  codeGenerationTime: {
    type: Date,
    default: time.now()
  }
})

module.exports = mongoose.model('Code', Code)