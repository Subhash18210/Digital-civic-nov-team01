const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Config
dotenv.config();

// 2. Create App
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Import Routes
const authRoutes = require('./routes/userRoutes'); 
const petitionRoutes = require('./routes/petitionRoutes'); 
const pollRoutes = require('./routes/pollRoutes');
const reportRoutes = require('./routes/reportRoutes'); // <--- ✅ NEW: Import Reports

// 5. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/petitions', petitionRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/reports', reportRoutes); // <--- ✅ NEW: Enable Reports Endpoint

// 6. Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ DB Connection Error:', err));

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});