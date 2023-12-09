import { Buffer } from 'buffer';

export function getHash(input: string, algo = 'SHA-256') {
  const buffer = new TextEncoder().encode(input);
  return crypto.subtle.digest(algo, buffer).then((hash) => {
    // here hash is an arrayBuffer, so we'll convert it to its hex version
    let result = '';
    const view = new DataView(hash);
    for (let i = 0; i < hash.byteLength; i += 4) {
      result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
    }
    return result;
  });
}

export async function generateKeyPair() {
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

export async function generateAesKey() {
  return await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function encryptDataWithAes(aesKey: CryptoKey, data: string) {
  const encodedData = new TextEncoder().encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, aesKey, encodedData);
  return { encrypted, iv };
}

export async function encryptAesKey(rsaPublicKey: CryptoKey, aesKey: CryptoKey) {
  const exportedAesKey = await crypto.subtle.exportKey('raw', aesKey);
  return await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaPublicKey, exportedAesKey);
}

export async function decryptAesKey(rsaPrivateKey: CryptoKey, encryptedKey: ArrayBufferLike) {
  const decryptedKey = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, rsaPrivateKey, encryptedKey);
  return await crypto.subtle.importKey('raw', decryptedKey, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
}

export async function decryptDataWithAes(aesKey: CryptoKey, encryptedData: ArrayBufferLike, iv: ArrayBufferLike) {
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, aesKey, encryptedData);
  return new TextDecoder().decode(decrypted);
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  return bufferToBase64(await crypto.subtle.exportKey('spki', key));
}

export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('pkcs8', key);
  return bufferToBase64(exported);
}

export async function importPublicKey(exportedKey: string) {
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

export async function importPrivateKey(base64: string) {
  const keyBuffer = base64ToBuffer(base64);
  return await crypto.subtle.importKey('pkcs8', keyBuffer, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']);
}

export function bufferToBase64(buffer: ArrayBufferLike): string {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer) as unknown as number[]));
}

export function base64ToBuffer(base64: string): ArrayBufferLike {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const encrypt = async (payload: any, encryptionPublicKey: string) => {
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

export const decrypt = async (encryptedData: string, iv: string, encryptedAesKey: string, decryptionPrivateKey: string) => {
  const privateKey = await importPrivateKey(decryptionPrivateKey);
  const decryptedAesKey = await decryptAesKey(privateKey, base64ToBuffer(encryptedAesKey));
  return JSON.parse(await decryptDataWithAes(decryptedAesKey, base64ToBuffer(encryptedData), base64ToBuffer(iv)));
};

export const decodeHexString = (hexString: string) => {
  if (!hexString.startsWith('0x')) {
    console.log('Invalid hex string', hexString);
    return '';
  }
  if (hexString === '0x') {
    return '';
  }
  return Buffer.from(hexString.slice(2), 'hex').toString();
};
