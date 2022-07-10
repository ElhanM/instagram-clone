const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connect');
const post = require('./routes/posts');

require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api/posts', post);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();