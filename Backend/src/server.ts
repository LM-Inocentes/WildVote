import dotenv from 'dotenv';
dotenv.config();


import { dbConnect } from './configs/database.config';
import express from "express";
import cors from "cors";

import userRouter from './routers/user.router';
import uploadRouter from './routers/upload.router';
import miscRouter from "./routers/misc.router"

dbConnect();

const app = express();


app.use(express.json());
app.use(cors({
    credentials: true,
    origin:["http://localhost:4200"],
}));

app.use("/api/users/", userRouter);
app.use("/api/uploads/", uploadRouter);
app.use("/api/misc/", miscRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Website is served on http://localhost:" +port);
})