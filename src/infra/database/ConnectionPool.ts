/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

export default class ConnectionPool {
    private static instance: pgPromise.IDatabase<any>;

    // private constructor () {}

    static getInstance(): pgPromise.IDatabase<any> {
      if (!ConnectionPool.instance) {
        const options = {
          pgFormatting: true
        } as pgPromise.IInitOptions;
        const pgp: pgPromise.IMain<any, IClient> = pgPromise<any, IClient>(options);

        pgp.pg.types.setTypeParser(1700, (value) => {
          return parseFloat(value);
        });

        ConnectionPool.instance = pgp({
          database: 'clean_code_architecture',
          user: 'postgres',
          password: 'postgres',
          host: '172.17.0.2',
          port: 5432,
          max: 10,
          idleTimeoutMillis: 0
        });
      }
      const connection = ConnectionPool.instance;
      return connection;
    }

    static save (statement: string, params: any[]): Promise<any> {
      return ConnectionPool.getInstance().none(statement, params);
    }

    static query (statement: string, params: any[]): Promise<any> {
      return ConnectionPool.getInstance().query(statement, params);
    }

    static one (statement: string, params: any[]): Promise<any> {
      return ConnectionPool.getInstance().one(statement, params);
    }
}
