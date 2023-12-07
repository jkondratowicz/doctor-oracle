import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export function successResponse<T>(data: T, headers: Record<string, string> = {}): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { ...corsHeaders, ...headers },
  };
}

export function errorResponse(statusCode: number, errorMessage: string): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify({ errorMessage }),
    headers: corsHeaders,
  };
}

export const getRequestBody = <T = any>(event: APIGatewayProxyEvent): Record<string, T> => {
  if (event.body) {
    return JSON.parse(event.body);
  }
  return {};
};
