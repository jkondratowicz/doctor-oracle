const OPENAI_MODEL = 'gpt-3.5-turbo';
const HTTP_TIMEOUT = 9000;
const SIMULATE_RESPONSE = true;
const [inputCid, patientPublicKeyB64] = args;

// Secrets:
// - openAIApiKey
// - secretString
// - quickNodeApiKey
// - IPFSGatewayUrl

async function generateAesKey() {
  return await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

async function encryptDataWithAes(aesKey: CryptoKey, data: string) {
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
    // Used for testing when OpenAI API is down / rate limited / has high latency
    return 'I recommend you take some ibuprofen and rest a bit.';
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

async function saveToIPFS(content: string, filename: string) {
  const options = {
    url: secrets.IPFSGatewayUrl,
    method: 'POST',
    data: JSON.stringify({
      quickNodeApiKey: secrets.quickNodeApiKey,
      content,
      filename,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: HTTP_TIMEOUT,
  };

  const quickNodeResponse = await Functions.makeHttpRequest(options);

  if (quickNodeResponse.error || !quickNodeResponse?.data?.cid) {
    console.log(JSON.stringify(quickNodeResponse, null, 2));
    throw new Error('IPFS gateway API error');
  }

  return quickNodeResponse.data.cid;
}

const { encryptedData, iv, encryptedAesKey } = await getIPFSData(inputCid);

const decryptedData = await decrypt(encryptedData, iv, encryptedAesKey, secrets.secretString);

const doctorsResponse = await getResponseFromLLM(decryptedData);

const returnData = await encrypt(doctorsResponse, patientPublicKeyB64);

const cid = await saveToIPFS(JSON.stringify(returnData), 'encryptedResponse.txt');

return Functions.encodeString(cid);
