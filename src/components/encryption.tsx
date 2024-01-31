import CryptoJS from "crypto-js";

export function encrypt(data) {
  // var encrypted;
  const HexENCRYPTION_KEY = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY!.replace(/['"]+/g, ''));
  const HexIV = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_IV!.replace(/['"]+/g, ''));
  if (typeof data === "object") {
    try {
      // eslint-disable-next-line no-param-reassign
      data = JSON.stringify(data);
    } catch (error) {
      console.log("encrypt error:", error);
      return null;
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataHex, HexENCRYPTION_KEY!, {
    iv: HexIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
}

export function decrypt(data) {
  const HexENCRYPTION_KEY = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY!.replace(/['"]+/g, ''));
  const HexIV = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_IV!.replace(/['"]+/g, ''));
  console.log("data on encryption", process.env.REACT_APP_ENCRYPTION_KEY!.replace(/['"]+/g, ''))
  const processedData = data;
  const encryptedHexStr = CryptoJS.enc.Hex.parse(processedData);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(str, HexENCRYPTION_KEY!, {
    iv: HexIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  console.log("decrypt", decrypt)
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  if (decryptedStr.toString() === "") {
    return 0;
  }
  
  return JSON.parse(decryptedStr.toString());
}
