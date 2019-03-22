var Mock = require('mockjs');
Mock.setup({ timeout: 2000 });

import ConfigResult from '@/Config.json';
import DataResult from '@/Data.json';
/**
 * mone-query配置
 */
Mock.mock(/api\/config/, 'get', () => {
  return ConfigResult;
});
/**
 * mone-query配置
 */
Mock.mock("/api/data", DataResult);
