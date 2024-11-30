require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(cors({
  origin: 'https://learning-project-qe5qpj76t-venky24102004s-projects.vercel.app', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Middleware app.use(cors());
app.use(bodyParser.json());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  inTime: String,
  status: String,
});

const User = mongoose.model('User', userSchema);

// Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to update inTime and mark status as Present
app.put('/api/update-intime', async (req, res) => {
  const { number } = req.body; // Extract the user's number from the request
  const currentTime = new Date().toLocaleString(); // Get the current time

  try {
    // Find the user by number and update inTime and status
    const updatedUser = await User.findOneAndUpdate(
      { number: number }, // Find user with this number
      {
        inTime: currentTime, // Update inTime
        status: 'Present',   // Update status to Present
      },
      { new: true } // Return the updated document
    );

    if (updatedUser) {
      res.status(200).json({
        message: 'In-time updated and user marked as Present',
        updatedUser,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

