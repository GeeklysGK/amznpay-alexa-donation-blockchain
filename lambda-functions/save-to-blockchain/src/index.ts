// lambda.js
import * as serverlessExpress from "@vendia/serverless-express";
import app from "./app";
exports.handler = serverlessExpress.configure({app})
