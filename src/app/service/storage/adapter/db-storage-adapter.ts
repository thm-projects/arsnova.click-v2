import { DB_NAME } from '../../../shared/enums';
import { AbstractIndexedDbAdapter } from './abstract-indexed-db-adapter';


export class DbStorageAdapter extends AbstractIndexedDbAdapter {

  constructor(dbName: DB_NAME) {
    super(indexedDB, dbName);
  }

}
