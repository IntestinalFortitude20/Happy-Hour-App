const mongoose = require('mongoose');

// Define the schema for a HappyHour event.
// This tells Mongoose what fields a happy hour document should have.
const happyHourSchema = new mongoose.Schema({
  eventType: {
      type: String,
      required: true,
      // The 'enum' validator restricts the value to one of the strings in the array.
      enum: ['Happy Hour', 'Bingo', 'Trivia', 'Live Music', 'Jam Session', 'Other']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  // An array to store the day(s) of the week for the event
  daysOfWeek: [{
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  }],
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from the beginning and end of the string
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  specials: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // You can add more fields as needed
}, {
  // This option automatically adds `createdAt` and `updatedAt` fields to your documents.
  timestamps: true
});

// Create the Mongoose model from the schema.
// Mongoose will automatically create a collection called 'happyhours' based on the model name.
const HappyHour = mongoose.model('HappyHour', happyHourSchema);

// Export the model so it can be used in other files, like your API routes.
module.exports = HappyHour;