"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCorsOptions = exports.DoctorOracleIPFSStack = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const path_1 = require("path");
class DoctorOracleIPFSStack extends aws_cdk_lib_1.Stack {
    constructor(app, id) {
        super(app, id);
        const param = new aws_cdk_lib_1.aws_ssm.StringParameter(this, 'QUICKNODE_API_KEY', {
            stringValue: 'QUICKNODE_API_KEY',
            parameterName: 'QuickNodeApiKey',
        });
        const nodeJsFunctionProps = {
            bundling: {
                externalModules: ['aws-sdk'],
            },
            depsLockFilePath: (0, path_1.join)(__dirname, 'lambdas', 'package-lock.json'),
            environment: {
                QUICKNODE_API_KEY: param.stringValue,
            },
            runtime: aws_lambda_1.Runtime.NODEJS_18_X,
        };
        const lambda = new aws_lambda_nodejs_1.NodejsFunction(this, 'uploadToIPFSFunction', {
            entry: (0, path_1.join)(__dirname, 'lambdas', 'upload.ts'),
            ...nodeJsFunctionProps,
        });
        const apiGatewayIntegration = new aws_apigateway_1.LambdaIntegration(lambda);
        // Create an API Gateway resource for each of the CRUD operations
        const api = new aws_apigateway_1.RestApi(this, 'IPFSApi', {
            restApiName: 'Upload to IPFS',
        });
        const upload = api.root.addResource('upload');
        upload.addMethod('POST', apiGatewayIntegration);
        addCorsOptions(upload);
    }
}
exports.DoctorOracleIPFSStack = DoctorOracleIPFSStack;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new aws_apigateway_1.MockIntegration({
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
        passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
        requestTemplates: {
            'application/json': '{"statusCode": 200}',
        },
    }), {
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
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new aws_cdk_lib_1.App();
new DoctorOracleIPFSStack(app, 'DoctorOracleIPFSStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBeUg7QUFDekgsdURBQWlEO0FBQ2pELDZDQUF5RDtBQUN6RCxxRUFBb0Y7QUFDcEYsK0JBQTRCO0FBRTVCLE1BQWEscUJBQXNCLFNBQVEsbUJBQUs7SUFDOUMsWUFBWSxHQUFRLEVBQUUsRUFBVTtRQUM5QixLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWYsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDL0QsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxhQUFhLEVBQUUsaUJBQWlCO1NBQ2pDLENBQUMsQ0FBQztRQUVILE1BQU0sbUJBQW1CLEdBQXdCO1lBQy9DLFFBQVEsRUFBRTtnQkFDUixlQUFlLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDN0I7WUFDRCxnQkFBZ0IsRUFBRSxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixDQUFDO1lBQ2pFLFdBQVcsRUFBRTtnQkFDWCxpQkFBaUIsRUFBRSxLQUFLLENBQUMsV0FBVzthQUNyQztZQUNELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7U0FDN0IsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDOUQsS0FBSyxFQUFFLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDO1lBQzlDLEdBQUcsbUJBQW1CO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE1BQU0scUJBQXFCLEdBQUcsSUFBSSxrQ0FBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1RCxpRUFBaUU7UUFDakUsTUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDdkMsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hELGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QixDQUFDO0NBQ0Y7QUFwQ0Qsc0RBb0NDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFdBQXNCO0lBQ25ELFdBQVcsQ0FBQyxTQUFTLENBQ25CLFNBQVMsRUFDVCxJQUFJLGdDQUFlLENBQUM7UUFDbEIsb0JBQW9CLEVBQUU7WUFDcEI7Z0JBQ0UsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLGtCQUFrQixFQUFFO29CQUNsQixxREFBcUQsRUFBRSx5RkFBeUY7b0JBQ2hKLG9EQUFvRCxFQUFFLEtBQUs7b0JBQzNELHlEQUF5RCxFQUFFLFNBQVM7b0JBQ3BFLHFEQUFxRCxFQUFFLCtCQUErQjtpQkFDdkY7YUFDRjtTQUNGO1FBQ0QsbUJBQW1CLEVBQUUsb0NBQW1CLENBQUMsS0FBSztRQUM5QyxnQkFBZ0IsRUFBRTtZQUNoQixrQkFBa0IsRUFBRSxxQkFBcUI7U0FDMUM7S0FDRixDQUFDLEVBQ0Y7UUFDRSxlQUFlLEVBQUU7WUFDZjtnQkFDRSxVQUFVLEVBQUUsS0FBSztnQkFDakIsa0JBQWtCLEVBQUU7b0JBQ2xCLHFEQUFxRCxFQUFFLElBQUk7b0JBQzNELHFEQUFxRCxFQUFFLElBQUk7b0JBQzNELHlEQUF5RCxFQUFFLElBQUk7b0JBQy9ELG9EQUFvRCxFQUFFLElBQUk7aUJBQzNEO2FBQ0Y7U0FDRjtLQUNGLENBQ0YsQ0FBQztBQUNKLENBQUM7QUFsQ0Qsd0NBa0NDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUN4RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIExhbWJkYUludGVncmF0aW9uLCBNb2NrSW50ZWdyYXRpb24sIFBhc3N0aHJvdWdoQmVoYXZpb3IsIFJlc3RBcGkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBSdW50aW1lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBhd3Nfc3NtIGFzIHNzbSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IE5vZGVqc0Z1bmN0aW9uLCBOb2RlanNGdW5jdGlvblByb3BzIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgY2xhc3MgRG9jdG9yT3JhY2xlSVBGU1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKGFwcCwgaWQpO1xuXG4gICAgY29uc3QgcGFyYW0gPSBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAnUVVJQ0tOT0RFX0FQSV9LRVknLCB7XG4gICAgICBzdHJpbmdWYWx1ZTogJ1FVSUNLTk9ERV9BUElfS0VZJyxcbiAgICAgIHBhcmFtZXRlck5hbWU6ICdRdWlja05vZGVBcGlLZXknLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgbm9kZUpzRnVuY3Rpb25Qcm9wczogTm9kZWpzRnVuY3Rpb25Qcm9wcyA9IHtcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGV4dGVybmFsTW9kdWxlczogWydhd3Mtc2RrJ10sXG4gICAgICB9LFxuICAgICAgZGVwc0xvY2tGaWxlUGF0aDogam9pbihfX2Rpcm5hbWUsICdsYW1iZGFzJywgJ3BhY2thZ2UtbG9jay5qc29uJyksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBRVUlDS05PREVfQVBJX0tFWTogcGFyYW0uc3RyaW5nVmFsdWUsXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICB9O1xuXG4gICAgY29uc3QgbGFtYmRhID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICd1cGxvYWRUb0lQRlNGdW5jdGlvbicsIHtcbiAgICAgIGVudHJ5OiBqb2luKF9fZGlybmFtZSwgJ2xhbWJkYXMnLCAndXBsb2FkLnRzJyksXG4gICAgICAuLi5ub2RlSnNGdW5jdGlvblByb3BzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpR2F0ZXdheUludGVncmF0aW9uID0gbmV3IExhbWJkYUludGVncmF0aW9uKGxhbWJkYSk7XG5cbiAgICAvLyBDcmVhdGUgYW4gQVBJIEdhdGV3YXkgcmVzb3VyY2UgZm9yIGVhY2ggb2YgdGhlIENSVUQgb3BlcmF0aW9uc1xuICAgIGNvbnN0IGFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICdJUEZTQXBpJywge1xuICAgICAgcmVzdEFwaU5hbWU6ICdVcGxvYWQgdG8gSVBGUycsXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGxvYWQgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgndXBsb2FkJyk7XG4gICAgdXBsb2FkLmFkZE1ldGhvZCgnUE9TVCcsIGFwaUdhdGV3YXlJbnRlZ3JhdGlvbik7XG4gICAgYWRkQ29yc09wdGlvbnModXBsb2FkKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29yc09wdGlvbnMoYXBpUmVzb3VyY2U6IElSZXNvdXJjZSkge1xuICBhcGlSZXNvdXJjZS5hZGRNZXRob2QoXG4gICAgJ09QVElPTlMnLFxuICAgIG5ldyBNb2NrSW50ZWdyYXRpb24oe1xuICAgICAgaW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIicqJ1wiLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiBcIidmYWxzZSdcIixcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUnXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBwYXNzdGhyb3VnaEJlaGF2aW9yOiBQYXNzdGhyb3VnaEJlaGF2aW9yLk5FVkVSLFxuICAgICAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICd7XCJzdGF0dXNDb2RlXCI6IDIwMH0nLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB7XG4gICAgICBtZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfVxuICApO1xufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgRG9jdG9yT3JhY2xlSVBGU1N0YWNrKGFwcCwgJ0RvY3Rvck9yYWNsZUlQRlNTdGFjaycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=