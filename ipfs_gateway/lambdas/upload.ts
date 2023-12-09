import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import FormData = require('form-data');
import { errorResponse, getRequestBody, successResponse } from './utils';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`Request: ${JSON.stringify(event, null, 2)}`);
  try {
    const body = getRequestBody(event);
    console.log('body', JSON.stringify(body, null, 2));

    const formData = new FormData();
    formData.append('Key', body.filename);
    formData.append('Body', Buffer.from(body.content), body.filename);
    formData.append('ContentType', 'text/plain');

    const response = await axios.request({
      method: 'POST',
      url: 'https://api.quicknode.com/ipfs/rest/v1/s3/put-object',
      headers: {
        'x-api-key': body.quickNodeApiKey || process.env.QUICKNODE_API_KEY,
      },
      data: formData,
    });
    console.log('result', JSON.stringify(response.data, null, 2));
    return successResponse({ cid: response?.data?.pin?.cid });
  } catch (e: any) {
    console.error(e);
    return errorResponse(500, 'Internal error');
  }
};
