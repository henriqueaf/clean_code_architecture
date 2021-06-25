import ConnectionPool from '../infra/database/ConnectionPool';

afterAll(async done => {
  // Closing the DB connection allows Jest to exit successfully.
  await ConnectionPool.getInstance().$pool.end();
  done();
});
