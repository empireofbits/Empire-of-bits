const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 1. Load environment variables FIRST
dotenv.config({ path: './config.env' });

// 2. Verify critical environment variables before proceeding
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('FATAL ERROR: Database configuration is missing!');
  process.exit(1);
}

// 3. Safely replace the password placeholder
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// 4. Connect to MongoDB
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful'))
  .catch(err => console.error('DB connection failed:', err));

// 5. Error handlers (keep these at the bottom)
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});