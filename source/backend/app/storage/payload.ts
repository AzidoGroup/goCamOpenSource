import { config } from '../config';

export class AvsStoragePayload {
  private payloadList: IPayloadList;

  constructor() {
    this.payloadList = {};
  }

  public store(payload: string) {
    if (this.isStored(payload)) {
      return;
    }

    this.payloadList[payload] = {
      payload: payload,
      created: this.getNow(),
    };
  }

  public isStored(payload: string) {
    return typeof this.payloadList[payload] != 'undefined';
  }

  public isExpired(payload: string) {
    if (!this.isStored(payload)) {
      return false;
    }

    const payloadData = this.payloadList[payload];
    const created = payloadData.created;
    const now = this.getNow();

    return created + config.storage.payloadExpirationTime > now;
  }

  private getNow() {
    return +new Date();
  }
}

export interface IPayloadList {
  [key: string]: IPayloadListItem;
}

export interface IPayloadListItem {
  payload: string;
  created: number;
}
