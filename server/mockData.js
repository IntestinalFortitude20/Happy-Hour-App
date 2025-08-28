// Mock data for testing the map without MongoDB
const mockEvents = [
  {
    _id: "1",
    name: "The Dive Bar",
    eventType: "Happy Hour",
    startTime: "4:00 PM",
    endTime: "7:00 PM",
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    address: "123 Main St, Austin, TX 78701",
    location: {
      latitude: 30.2672,
      longitude: -97.7431
    },
    specials: "$2 drafts, $5 cocktails"
  },
  {
    _id: "2",
    name: "Trivia Palace",
    eventType: "Trivia",
    startTime: "7:00 PM",
    endTime: "9:00 PM",
    daysOfWeek: ["Tuesday"],
    address: "456 Oak Ave, Austin, TX 78703",
    location: {
      latitude: 30.2711,
      longitude: -97.7437
    },
    specials: "Half-price appetizers"
  },
  {
    _id: "3",
    name: "Music Venue Downtown",
    eventType: "Live Music",
    startTime: "8:00 PM",
    endTime: "11:00 PM",
    daysOfWeek: ["Friday", "Saturday"],
    address: "789 6th St, Austin, TX 78702",
    location: {
      latitude: 30.2648,
      longitude: -97.7373
    },
    specials: "No cover with food purchase"
  },
  {
    _id: "4",
    name: "Bingo Barn",
    eventType: "Bingo",
    startTime: "6:00 PM",
    endTime: "10:00 PM",
    daysOfWeek: ["Wednesday", "Sunday"],
    address: "321 Cedar St, Austin, TX 78704",
    location: {
      latitude: 30.2518,
      longitude: -97.7596
    },
    specials: "Free drinks for winners"
  },
  {
    _id: "5",
    name: "The Jam Session Café",
    eventType: "Jam Session",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    daysOfWeek: ["Thursday"],
    address: "654 Guadalupe St, Austin, TX 78705",
    location: {
      latitude: 30.2849,
      longitude: -97.7341
    },
    specials: "Open mic, free coffee for performers"
  }
];

module.exports = mockEvents;