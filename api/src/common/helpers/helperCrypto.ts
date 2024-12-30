import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class cryptoHelper {
  constructor() {}

  generateMasterKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  }
}
