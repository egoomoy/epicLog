import { APIGatewayProxyHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './app';

const serverlessApp = serverless(app);
export const intro: APIGatewayProxyHandler = async (event, context) => {
  return await serverlessApp(event, context);
};
