import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";


// routes
import AuthRoute from './routes/AuthRoute.js'


const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

dotenv.config();
const PORT = process.env.PORT;

const dataBaseUrl =process.env.DATABASE_URL;

mongoose.connect(dataBaseUrl);

const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.listen(PORT, () => {
    console.log(`Server up at ${PORT}`)
  });

app.use('/auth', AuthRoute);