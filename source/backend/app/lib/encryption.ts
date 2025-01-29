import { config } from '../config';

import crypto from 'crypto';

export class AvsEncryption {
  static encryptObject(object: object): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      config.encryption.algorithm,
      Buffer.from(config.encryption.key),
      iv
    );

    let encrypted = cipher.update(JSON.stringify(object));

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + '|:' + encrypted.toString('hex');
  }

  static decryptString(encryptedString: string): any {
    const encryptedStringParts = encryptedString.split(':');

    const iv = Buffer.from(encryptedStringParts[0], 'hex');
    const encryptedData = Buffer.from(encryptedStringParts[1], 'hex');

    const decipher = crypto.createDecipheriv(
      config.encryption.algorithm,
      Buffer.from(config.encryption.key),
      iv
    );

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString());
  }

  static base64EncodeObject(object: object): string {
    return Buffer.from(JSON.stringify(object)).toString('base64');
  }

  static base64DecodeString(encryptedString: string): any {
    return JSON.parse(Buffer.from(encryptedString, 'base64').toString('ascii'));
  }
}
