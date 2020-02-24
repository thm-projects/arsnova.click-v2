import Dexie from 'dexie';
import { ReplaySubject } from 'rxjs';
import { QuizEntity } from '../entities/QuizEntity';
import { DbName, DbTable, StorageKey } from '../enums/enums';

export class AppDb extends Dexie {
  public readonly initialized: ReplaySubject<void> = new ReplaySubject<void>(1);
  public readonly [DbTable.Config]: Dexie.Table<{ type: StorageKey, value: any }, StorageKey>;
  public readonly [DbTable.Quiz]: Dexie.Table<QuizEntity, string>;

  constructor(dbName: DbName) {
    super(dbName);

    this.version(0.1).stores({
      [DbTable.Config]: '++id,&id',
      [DbTable.Quiz]: '++id,&id',
    });

    this.version(0.2)
    .stores({
      [DbTable.Config]: null,
      [DbTable.Quiz]: null,
    }).upgrade(trans => {
      trans.idbtrans.db.deleteObjectStore(DbTable.Quiz);
      trans.idbtrans.db.deleteObjectStore(DbTable.Config);
    });

    this.version(1).stores({
      [DbTable.Config]: 'type',
      [DbTable.Quiz]: 'name',
    });

    this.Config.get(StorageKey.PrivateKey).then(privateKey => {
      if (privateKey) {
        sessionStorage.setItem(StorageKey.PrivateKey, privateKey.value);
        this.initialized.next();
        return;
      }

      privateKey = {
        value: AppDb.generatePrivateKey(),
        type: StorageKey.PrivateKey,
      };
      sessionStorage.setItem(StorageKey.PrivateKey, privateKey.value);
      this.Config.put(privateKey).then(() => this.initialized.next()).catch(() => {});
    }).catch(() => {});

  }

  public async getAllQuiznames(): Promise<Array<string>> {
    return (await this.Quiz.toArray()).map(value => value.name);
  }

  public static generatePrivateKey(length?: number): string {
    const arr = new Uint8Array((length || 40) / 2);

    window.crypto.getRandomValues(arr);
    return Array.from(arr, AppDb.dec2hex).join('');
  }

  private static dec2hex(dec): string {
    return ('0' + dec.toString(16)).substr(-2);
  }
}