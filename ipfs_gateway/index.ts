import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class DoctorOracleIPFSStack extends Stack {
  constructor(app: App, id: string) {
    super(app, id);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      depsLockFilePath: join(__dirname, 'lambdas', 'package-lock.json'),
      environment: {},
      runtime: Runtime.NODEJS_18_X,
    };

    const lambda = new NodejsFunction(this, 'uploadToIPFSFunction', {
      entry: join(__dirname, 'lambdas', 'upload.ts'),
      ...nodeJsFunctionProps,
    });

    const apiGatewayIntegration = new LambdaIntegration(lambda);

    // Create an API Gateway resource for each of the CRUD operations
    const api = new RestApi(this, 'IPFSApi', {
      restApiName: 'Upload to IPFS',
    });

    const upload = api.root.addResource('upload');
    upload.addMethod('POST', apiGatewayIntegration);
    addCorsOptions(upload);
  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod(
    'OPTIONS',
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'false'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    }
  );
}

const app = new App();
new DoctorOracleIPFSStack(app, 'DoctorOracleIPFSStack');
app.synth();
