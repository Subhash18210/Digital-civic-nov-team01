const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config();

// 2. CREATE THE APP (This was missing or in the wrong spot)
const app = express();

// 3. Middleware (Must come AFTER creating app)
app.use(cors());
app.use(express.json());

// 4. Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 5. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('DB Connection Error:', err));

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});