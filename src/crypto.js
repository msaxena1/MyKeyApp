const getKey = async function ( s1, s2 ) {
  try {

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
  catch ( err ) {
    console.log('Error getting key: ' + err );
    return Promise.reject('Error: Failed getting encryptKey');
  }

}

const encrypt = async function( content, key, iv ) {
  try {
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
    console.log('got key')

    return b64;
  }
  catch( err ) {
    console.log('failed to encrypt')
    return Promise.reject('Error: Fail to encrypt');
  }

}

const decrypt = async function( cipher, key, iv ) {
  try {
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
  catch ( err ) {
    console.log('failed to decrypt: ' + err);
    return Promise.reject('Error: Fail to decrypt');
  }
}

const getIv = () => crypto.getRandomValues(new Uint8Array(16));

/*
async function test() {
  const text1 = 'An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.';
  const text2 = 'The inhabitants refer to it as the planet Earth.';
  const key = await getKey( text1, text2 );

  const iv = getIv();
  const textToEncrypt = 'the quick brown fox jump over the lazy dogs back'

  const cipherText = await encrypt(textToEncrypt, key, iv );
  console.log(cipherText)

  const decodedText = await decrypt( cipherText, key, iv );
  console.log(decodedText)
}

// test()

*/
export { getKey, getIv, encrypt, decrypt }

