import sql from 'mssql/msnodesqlv8';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: any = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER || 'localhost'};Database=${process.env.DB_DATABASE || 'YourDatabaseName'};Trusted_Connection=yes;`,
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Підключення до бази даних успішне');
    return pool;
  })
  .catch(err => {
    console.error('Помилка підключення до бази даних:', err);
    throw err;
  });

export default poolPromise;
