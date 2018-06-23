import { AbstractWindowStorageAdapter } from './abstract-window-storage-adapter';

export class SessionStorageAdapter extends AbstractWindowStorageAdapter<Storage> {

  constructor() {
    super(sessionStorage);
  }
}
