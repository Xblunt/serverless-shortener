import { getLogger, Driver, MetadataAuthService, getSACredentialsFromJson, IamAuthService } from 'ydb-sdk';
import { IAuthService } from 'ydb-sdk/build/credentials';

export const logger = getLogger();
export let driver: Driver;

export async function initDb() {
  logger.info('Driver initializing...');
  
  if (!process.env.ENDPOINT || !process.env.DATABASE) {
      throw new Error('Missing YDB connection parameters!');
  }

  let authService: IAuthService;
  if (process.env.LOCAL_DEVELOPMENT === 'true') {
      const saKeyFile = process.env.SA_KEY_FILE;
      if (!saKeyFile) throw new Error('SA_KEY_FILE is required for local development');
      const saCredentials = getSACredentialsFromJson(require('path').resolve(saKeyFile));
      authService = new IamAuthService(saCredentials);
  } else {
      authService = new MetadataAuthService();
  }

  driver = new Driver({
      endpoint: process.env.ENDPOINT,
      database: process.env.DATABASE,
      authService: authService,
  });

  if (!(await driver.ready(15000))) {
      throw new Error('Driver failed to initialize');
  }
  logger.info('Driver ready');
}
