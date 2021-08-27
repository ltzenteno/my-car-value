import { rm } from 'fs/promises';
import { join } from 'path/posix';
import { getConnection } from 'typeorm';

// NOTE: this file is read because we added the "setupFilesAfterEnv" property in jest-e2e.json

/**
 * this global beforeEach will be execued before every single test across all of our e2e files
 */
global.beforeEach(async () => {
  // removing test.sqlite file
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

global.afterEach(async () => {
  const conn = getConnection();

  await conn.close();
});