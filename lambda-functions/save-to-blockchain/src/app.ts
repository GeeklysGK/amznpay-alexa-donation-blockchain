import express from "express";
import * as bodyParser from "body-parser";
import cors from 'cors';
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended: true}))

//routers
import index from "./route/index";
app.use('/', index)

export default app;