import forge from "node-forge";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyPath = path.join(__dirname, "..", "rsa_1024_priv.pem");

const privateKeyPem = fs.readFileSync(privateKeyPath, "utf8");

// Decrypt data with private key
function decryptData(encryptedBase64) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(encryptedBase64);
  const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP");
  return decrypted;
}

export default decryptData;
