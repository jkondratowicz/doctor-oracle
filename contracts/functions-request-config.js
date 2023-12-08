const fs = require('fs');
const { Location, ReturnType, CodeLanguage } = require('@chainlink/functions-toolkit');

const requestConfig = {
  source: fs.readFileSync('./functions-source-dr-oracle.ts').toString(),
  codeLocation: Location.Inline,
  secrets: {
    openAIApiKey: process.env.OPENAI_API_KEY ?? '',
    secretString: process.env.SECRET_STRING ?? '',
    quickNodeApiKey: process.env.QUICKNODE_API_KEY ?? '',
    IPFSGatewayUrl: process.env.IPFS_GATEWAY_URL ?? '',
  },
  secretsLocation: Location.Remote,
  // 0: cid                       IPFS CID where encrypted patient data is stored
  // 1: patientPublicKeyBase64    public RSA key of the patient required to decrypt the AES key, which in turn decrypts patient data
  args: [
    'bafkreiefjl5wbloiqbmgpffiovrleyvteusoi6mnwaejs2vwitou3y5dey',
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzI+5pPEeYqvoh7LHnuCpeSA9mPYul7vFKs3V0lyT20IGaWPKdWttngAOxGcnGvz7+YSc1wjUvgHwxB/wQMCwJePlO67lRF7MHMcKq3lE2GGekIPpSq7b5DDv18hleQQPMmuv48juX612q+i66z9zKUFvNHII9kQcqKB4usZMQ1X5cqrt9g5nARNJIWnvj5I9oSnSBaiRcq2TLdWK3NAA6jZvvLPDhIfFu2c8njNd6iumgwA/U7FVcbwG5D2oLDluEoaqAfWkbFsXH7dBjslMU38JO0xxlpEiMGmrIQcFp/d8Lb7xyDbIInZl+rZEm1rPe/Ba6yN1O2SLnJ4mg3Z4uQIDAQAB',
  ],
  codeLanguage: CodeLanguage.JavaScript,
  expectedReturnType: ReturnType.string,
};

module.exports = requestConfig;
