import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as process from "process";

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
        RPC_SERVER: process.env["RPC_SERVER"] || ""
      }
    });

    //api gw
    const apigw = new apigateway.LambdaRestApi(this, `${appPrefix}-apigw-${envelopment}`, {
      handler: apiLambdaFunction,
    });


  }
}
