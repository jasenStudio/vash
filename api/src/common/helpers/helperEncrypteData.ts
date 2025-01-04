import { Injectable } from '@nestjs/common';
import { cryptoHelper, EncryptedData } from './helperCrypto';

interface EncryptedField {
  table_name: string;
  field_name: string;
  iv: string;
  tag: string;
}

@Injectable()
export class HelperEncryptData {
  constructor(private cryptoHelper: cryptoHelper) {}

  private encryptField(
    fieldName: string,
    value: string,
    tableName: string,
    masterKey: Buffer,
  ) {
    const { encryptedData, iv, tag } = this.cryptoHelper.encryptData(
      value,
      masterKey,
    );

    return {
      encryptedData,
      encryptedField: {
        table_name: tableName,
        field_name: fieldName,
        iv,
        tag,
      },
    };
  }

  public encryptDataSubcriptionDetail(
    data: any,
    masterKey: Buffer,
  ): {
    encryptedData: {
      password?: string;
    };
    encryptedFields: EncryptedField[];
  } {
    const encryptedFields: EncryptedField[] = [];
    const encryptedData = { ...data };
    if (data.password) {
      const { encryptedData: encPassword, encryptedField } = this.encryptField(
        'password',
        data.password,
        'subscription_details',
        masterKey,
      );
      encryptedData.password = encPassword;
      encryptedFields.push(encryptedField);
    }

    return { encryptedData, encryptedFields };
  }

  public encryptDataRecoveryMethod(methodValue: string, masterKey: Buffer) {
    const { encryptedData, iv, tag } = this.cryptoHelper.encryptData(
      methodValue,
      masterKey,
    );

    return { encryptedData, iv, tag };
  }

  public decryptData(encryptedData: EncryptedData, masterKey: Buffer) {
    const { data, iv, tag } = encryptedData;
    let decryptedData: string;

    if (data) {
      decryptedData = this.cryptoHelper.decryptData(
        { data, iv, tag },
        masterKey,
      );
    }

    return decryptedData;
  }
}
