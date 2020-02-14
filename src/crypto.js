const text1 = 'An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.';
const text2 = 'The inhabitants refer to it as the planet Earth.';
const iv = window.crypto.getRandomValues(new Uint8Array(16));
let key;

const getKey = ( s1, s2 ) => {
  
}
crypto.subtle.digest('SHA-512', new TextEncoder().encode(text1))
.then( digest1 => [ digest1 ] )
.then ( list => {
    return crypto.subtle.digest('SHA-512', new TextEncoder().encode(text2))
    .then( digest2 => ([...list, digest2 ]));
  } )
.then( secretDigest => {
  console.log(secretDigest)
  return crypto.subtle.importKey(
    "raw",
    new Uint8Array(secretDigest[1]),
    {name: "PBKDF2"},
    false,
    ["deriveBits", "deriveKey"]
  )
  .then( secret2Key => {
    
    return crypto.subtle.deriveKey(
      {
        "name": "PBKDF2",
        salt: new Uint8Array(secretDigest[0]),
        "iterations": 100000,
        "hash": "SHA-512"
      },
      secret2Key,
      { "name": "AES-GCM", "length": 256},
      true,
      [ "encrypt", "decrypt" ]
    );
  })
 } )
 .then( encryptKey => {
  key = encryptKey;
  const textToEncrypt = 'the quick brown fox jump over the lazy dogs back'
  //console.log( new TextEncoder().encode(textToEncrypt) );

  return crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    new TextEncoder().encode(textToEncrypt)
  )
  } )
  .then( cipherText => {
    const cipherTextU8 = new Uint8Array( cipherText );
    const b64 = btoa( cipherTextU8 );
    console.log( b64 )
    // console.log( new Uint8Array( cipherText ) )
    const buffer = new Uint8Array(atob(b64).split(','));
    //console.log(buffer)
    return crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      buffer //cipherText
    )
  } )
  .then( decryptText => console.log(new TextDecoder().decode(decryptText)))
.catch( err => console.log(err));