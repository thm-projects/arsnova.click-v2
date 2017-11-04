// DB Lib: https://github.com/typicode/lowdb

import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

export enum DatabaseTypes {
  quiz = 'quiz',
  assets = 'assets',
  mathjax = 'mathjax'
}

const adapter: FileSync = new FileSync('arsnova-click-v2-db-v1.json');

export class DbDao {

  private static db: lowdb;
  private static instance: DbDao;

  public static create(database: DatabaseTypes, data: Object, ref?: string): void {
    if (ref) {
      DbDao.db.set(`${database}.${ref}`, data).write();
    } else {
      DbDao.db.get(database).push(data).write();
    }
  }

  public static read(database: DatabaseTypes, query?: Object): Object {
    if (query) {
      return DbDao.db.get(database)
                  .find(query)
                  .value();
    }
    return DbDao.db.get(database)
                .value();
  }

  public static update(database: DatabaseTypes, query: Object, update: Object): void {
    DbDao.db.get(database)
         .find(query)
         .assign(update)
         .write();
  }

  public static delete(database: DatabaseTypes, query: {quizName: string, privateKey: string}): boolean {
    const dbContent: any = DbDao.read(database, query);
    if (!Object.keys(dbContent).length || dbContent.privateKey !== query.privateKey) {
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

  public static closeConnections(): void {
    Object.keys(DatabaseTypes).forEach((type) => DbDao.closeConnection(DatabaseTypes[type]));
  }

  public static getState(): lowdb {
    return DbDao.db.getState();
  }

  public static getInstance(): DbDao {
    if (!DbDao.instance) {
      DbDao.instance = new DbDao();
      DbDao.db = lowdb(adapter);
      const state = DbDao.getState();
      if (!state[DatabaseTypes.quiz]) {
        DbDao.initDb(DatabaseTypes.quiz, []);
      }
      if (!state[DatabaseTypes.assets]) {
        DbDao.initDb(DatabaseTypes.assets, {});
      }
      if (!state[DatabaseTypes.mathjax]) {
        DbDao.initDb(DatabaseTypes.mathjax, {});
      }
    }
    return DbDao.instance;
  }

  private static initDb(type: DatabaseTypes, initialValue: any) {
    DbDao.db.set(type, initialValue).write();
  }
}

export default DbDao.getInstance();
