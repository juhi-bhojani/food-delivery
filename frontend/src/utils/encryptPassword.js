import forge from "node-forge";

const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgr7shyDtzQdiqHIwK4kmq0h08
2CttV/lAowbkSQRx79oNjsOvXpp9xpdmL3hT6NTONNdSyf3MLeDvQtdZbGtSWvaR
iKSFsRXKKbjLt2JD5WyGlsUwvXIerHF6DcUsxTj2vvqIJxj7N9sNU6MIDPPcetHQ
hdRjDrJncCrA+U/buQIDAQAB
-----END PUBLIC KEY-----`;

// Encrypt data with public key
function encryptData(data) {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data, "RSA-OAEP");
  const encryptedBase64 = forge.util.encode64(encrypted);
  return encryptedBase64;
}

export default encryptData;
