// DB Lib: https://github.com/typicode/lowdb

import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

export enum DatabaseTypes {
  quiz = 'quiz',
}

const adapter: FileSync = new FileSync('arsnova-click-v2-db-v1.json');

export class DbDao {

  private static db: lowdb;
  private static instance: DbDao;

  public static create(database: DatabaseTypes, data: Object): void {
    DbDao.db.get(database).push(data).write();
  }

  public static read(database: DatabaseTypes, query: Object): Object {
    return DbDao.db.get(database)
                .find(query)
                .value();
  }

  public static update(database: DatabaseTypes, query: Object, update: Object): void {
    DbDao.db.get(database)
         .find(query)
         .assign(update)
         .write();
  }

  public static delete(database: DatabaseTypes, query: Object): boolean {
    if (!Object.keys(DbDao.read(database, query)).length) {
      return false;
    }
    DbDao.db.get(database)
         .remove(query)
         .write();
    return true;
  }

  public static closeConnection(database: DatabaseTypes): void {
    DbDao.db.get(database).close();
  }

  public static getState(): lowdb {
    return DbDao.db.getState();
  }

  public static getInstance(): DbDao {
    if (!DbDao.instance) {
      DbDao.instance = new DbDao();
      DbDao.db = lowdb(adapter);
      if (!Object.keys(DbDao.db.getState()).length) {
        DbDao.db.set(DatabaseTypes.quiz, [])
             .write();
      }
    }
    return DbDao.instance;
  }
}

export default DbDao.getInstance();
