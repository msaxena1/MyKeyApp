'use strict'

const getKey = async function ( s1, s2 ) {
  const digestS1 = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(s1));
  const digestS2 = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(s2));

  const s2Key = await crypto.subtle.importKey(
    'raw',
    new Uint8Array( digestS2 ),
    { name: 'PBKDF2' },
    false,
    [ 'deriveBits', 'deriveKey' ]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array( digestS1 ),
      iterations: 100000,
      hash: 'SHA-512'
    },
    s2Key,
    { name: 'AES-GCM', length: 256},
    true,
    [ 'encrypt', 'decrypt' ]
  );

  return key;
}

const encrypt = async function( content, key, iv ) {
  const cipherText = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    new TextEncoder().encode(content)
  );

  const cipherTextU8 = new Uint8Array( cipherText );
  const b64 = btoa( cipherTextU8 );
  return b64;
}

const decrypt = async function( cipher, key, iv ) {
  const buffer = new Uint8Array(atob(cipher).split(','));
  const decryptText = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    buffer
    );
  
  return new TextDecoder().decode( decryptText );
}

async function test() {
  const text1 = 'An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.';
  const text2 = 'The inhabitants refer to it as the planet Earth.';
  const key = await getKey( text1, text2 );

  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const textToEncrypt = 'the quick brown fox jump over the lazy dogs back'

  const cipherText = await encrypt(textToEncrypt, key, iv );
  console.log(cipherText)

  const decodedText = await decrypt( cipherText, key, iv );
  console.log(decodedText)
}

// test()
export default { getKey, encrypt, decrypt }
