import { AbstractWindowStorageAdapter } from './abstract-window-storage-adapter';

export class LocalStorageAdapter extends AbstractWindowStorageAdapter<Storage> {

  constructor() {
    super(localStorage);
  }
}
