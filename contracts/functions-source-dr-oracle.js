const OPENAI_MODEL = 'gpt-3.5-turbo';
const HTTP_TIMEOUT = 9000;
const SIMULATE_RESPONSE = false;
const [inputCid, patientPublicKeyB64] = args;

// Secrets:
// - openAIApiKey
// - secretString
// - quickNodeApiKey

async function generateKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt', 'decrypt']
  );
}

async function generateAesKey() {
  return await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

async function encryptDataWithAes(aesKey, data) {
  const encodedData = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, aesKey, encodedData);
  return { encrypted, iv };
}
async function encryptAesKey(rsaPublicKey: CryptoKey, aesKey: CryptoKey) {
  const exportedAesKey = await crypto.subtle.exportKey('raw', aesKey);
  return await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaPublicKey, exportedAesKey);
}

async function decryptAesKey(rsaPrivateKey: CryptoKey, encryptedKey) {
  const decryptedKey = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, rsaPrivateKey, encryptedKey);
  return await crypto.subtle.importKey('raw', decryptedKey, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
}

async function decryptDataWithAes(aesKey, encryptedData, iv) {
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, aesKey, encryptedData);
  return new TextDecoder().decode(decrypted);
}

async function exportPublicKey(key) {
  return bufferToBase64(await crypto.subtle.exportKey('spki', key));
}

async function exportPrivateKey(key) {
  const exported = await crypto.subtle.exportKey('pkcs8', key);
  return bufferToBase64(exported);
}

async function importPublicKey(exportedKey: string) {
  const key = base64ToBuffer(exportedKey);
  return await crypto.subtle.importKey(
    'spki',
    key,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt']
  );
}

async function importPrivateKey(base64: string) {
  const keyBuffer = base64ToBuffer(base64);
  return await crypto.subtle.importKey('pkcs8', keyBuffer, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']);
}

function bufferToBase64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const encrypt = async (payload: any, encryptionPublicKey: string) => {
  const publicKey = await importPublicKey(encryptionPublicKey);

  const aesKey = await generateAesKey();
  const { encrypted, iv } = await encryptDataWithAes(aesKey, JSON.stringify(payload));
  const encryptedAesKey = await encryptAesKey(publicKey, aesKey);

  return {
    encryptedData: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
    encryptedAesKey: bufferToBase64(encryptedAesKey),
  };
};

const decrypt = async (encryptedData: string, iv: string, encryptedAesKey: string, decryptionPrivateKey: string) => {
  const privateKey = await importPrivateKey(decryptionPrivateKey);
  const decryptedAesKey = await decryptAesKey(privateKey, base64ToBuffer(encryptedAesKey));
  return JSON.parse(await decryptDataWithAes(decryptedAesKey, base64ToBuffer(encryptedData), base64ToBuffer(iv)));
};

async function getIPFSData(cid) {
  const ipfsResponse = await Functions.makeHttpRequest({
    url: `https://${cid}.ipfs.w3s.link/`,
    method: 'GET',
    timeout: HTTP_TIMEOUT,
  });

  if (ipfsResponse.error) {
    console.log(JSON.stringify(ipfsResponse, null, 2));
    throw new Error('IPFS error');
  }

  return ipfsResponse.data;
}

async function getResponseFromLLM(previousPrompts) {
  if (!Array.isArray(previousPrompts)) {
    throw new Error('Malformed input data. Expected array of prompts and answers');
  }

  if (SIMULATE_RESPONSE) {
    return 'I recommend you take some ibuprofen';
  }

  const postData = {
    model: OPENAI_MODEL,
    messages: previousPrompts,
    temperature: 0,
  };

  const openAIResponse = await Functions.makeHttpRequest({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secrets.openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    data: postData,
    timeout: HTTP_TIMEOUT,
  });

  if (openAIResponse.error || !openAIResponse?.data?.choices?.[0]?.message?.content) {
    console.log(JSON.stringify(openAIResponse, null, 2));
    throw new Error('OpenAI API error');
  }

  return openAIResponse.data.choices[0].message.content;
}

async function saveToIPFS(content, filename) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const requestBody = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="Body"; filename="${filename}"`,
    'Content-Type: text/plain',
    '',
    content,
    `--${boundary}`,
    'Content-Disposition: form-data; name="Key"',
    '',
    filename,
    `--${boundary}`,
    'Content-Disposition: form-data; name="ContentType"',
    '',
    'text',
    `--${boundary}--`,
  ].join('\r\n');

  const options = {
    method: 'POST',
    url: 'https://api.quicknode.com/ipfs/rest/v1/s3/put-object',
    headers: {
      'x-api-key': secrets.quickNodeApiKey,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': requestBody.length,
    },
    data: requestBody,
    timeout: HTTP_TIMEOUT,
  };

  const quickNodeResponse = await Functions.makeHttpRequest(options);

  if (quickNodeResponse.error || !quickNodeResponse?.data?.pin?.cid) {
    console.log(JSON.stringify(quickNodeResponse, null, 2));
    throw new Error('QuickNode IPFS API error');
  }

  return quickNodeResponse.data.pin.cid;
}

console.log('start', patientPublicKeyB64, inputCid, secrets);
const patientPublicKey = decodeBase64(patientPublicKeyB64);
console.log('patientPublicKey', patientPublicKey);
const keyPair = box.keyPair.fromSecretKey(new TextEncoder().encode(secrets.secretString));
console.log('keyPair', keyPair);
const shared = box.before(patientPublicKey, keyPair.secretKey);
console.log('shared', shared);

const encryptedData = await getIPFSData(inputCid);
console.log('encryptedData', encryptedData);
const decryptedData = decrypt(shared, encryptedData);
console.log('decryptedData', decryptedData);

const doctorsResponse = await getResponseFromLLM(decryptedData);
const encryptedResponse = encrypt(shared, doctorsResponse);
const cid = await saveToIPFS(encryptedResponse, 'encryptedResponse.txt');

console.log(JSON.stringify(cid, null, 2));
return Functions.encodeString(cid);
