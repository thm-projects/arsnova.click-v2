import { DbName } from '../../../../lib/enums/enums';
import { AbstractIndexedDbAdapter } from './abstract-indexed-db-adapter';


export class DbStorageAdapter extends AbstractIndexedDbAdapter {

  constructor(dbName: DbName) {
    super(indexedDB, dbName);
  }

}
