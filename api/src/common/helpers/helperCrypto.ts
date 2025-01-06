import * as crypto from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import config from '../../config/configuration';
import { ConfigType } from '@nestjs/config';

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}
@Injectable()
export class cryptoHelper {
  constructor(
    @Inject(config.KEY)
    private __config: ConfigType<typeof config>,
  ) {}

  deriveMasterKey(password, salt) {
    const salt_hash = this.__config.salt_hash + salt;
    return crypto.pbkdf2Sync(password, salt_hash, 100000, 32, 'sha256');
  }

  encryptData(data, masterKey) {
    const iv = crypto.randomBytes(16); // Vector de inicialización
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag(); // Obtener TAG de autenticación
    return {
      encryptedData: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  decryptData(encryptedData: EncryptedData, masterKey: Buffer) {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      masterKey,
      Buffer.from(encryptedData.iv, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.data, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
