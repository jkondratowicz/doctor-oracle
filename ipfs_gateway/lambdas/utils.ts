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

// Functions simulator sends raw data, while DON-based functions send it stringified ( ͡° ͜ʖ ͡°)
export const getRequestBody = <T = any>(event: APIGatewayProxyEvent): Record<string, T> => {
  let parsed = event.body;
  while (typeof parsed !== 'object') {
    parsed = JSON.parse(parsed);
  }
  return parsed;
};
