import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as process from "process";
import * as sqs from '@aws-cdk/aws-sqs';
import {PolicyStatement} from "@aws-cdk/aws-iam";
import {SqsEventSource} from "@aws-cdk/aws-lambda-event-sources";
import {Duration} from "@aws-cdk/core";

export class AmznpayChainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const envelopment = process.env.NODE_ENV === "prod" ? "prod" : "dev";
    const appPrefix = "amzn-donation-blockchain";

    const lambdaExecRole = new iam.Role(this, `${appPrefix}-role-${envelopment}`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"),
      ],
    });


    const apiLambdaFunction = new lambda.Function(this, `${appPrefix}-tokenapi-function-${envelopment}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("../lambda-functions/save-to-blockchain/build/dist"),
      handler: "index.handler",
      role: lambdaExecRole,
      // timeout: Duration.seconds(10),
      memorySize: 256,
      environment: {
        NODE_ENV: process.env["NODE_ENV"] || "dev",
        WALLET_PRIVATE_KEY: process.env["WALLET_PRIVATE_KEY"] || "",
        RPC_SERVER: process.env["RPC_SERVER"] || "",
        AMAZON_PAY_CLIENT_ID: process.env["AMAZON_PAY_CLIENT_ID"] || ""
      }
    });

    //api gw
    const apigw = new apigateway.LambdaRestApi(this, `${appPrefix}-apigw-${envelopment}`, {
      handler: apiLambdaFunction,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        statusCode: 200
      }
    });

    const queue = new sqs.Queue(this, `${appPrefix}-queue-${envelopment}`, {
      deliveryDelay: Duration.seconds(20)
    });

    const sqsLambdaFunction = new lambda.Function(this, `${appPrefix}-sqsreceived-function${envelopment}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("../lambda-functions/save-to-blockchain/build/dist"),
      handler: "sqs.handler",
      role: lambdaExecRole,
      environment: {
        WALLET_PRIVATE_KEY: process.env["WALLET_PRIVATE_KEY"] || "",
        RPC_SERVER: process.env["RPC_SERVER"] || "",
        AMAZON_PAY_CLIENT_ID: process.env["AMAZON_PAY_CLIENT_ID"] || ""
      }
    });

    apiLambdaFunction.addEnvironment('QUEUE_URL', queue.queueUrl);
    sqsLambdaFunction.addEnvironment('QUEUE_URL', queue.queueUrl);
    apiLambdaFunction.addToRolePolicy(new PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [queue.queueArn]
    }));

    sqsLambdaFunction.addEventSource(new SqsEventSource(queue));

  }
}
