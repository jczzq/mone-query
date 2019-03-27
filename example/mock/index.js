var Mock = require('mockjs');
Mock.setup({ timeout: '800-3000' });

import ConfigResult from '@/Config.json';
import DataResult from '@/Data.json';

/**
 * 请求配置失败
 */
Mock.mock('/api/config-error', 'get', {
  resultCode: '0003',
  resultData: null,
  resultDesc: '未知的错误 😔'
});

/**
 * 请求配置成功
 */
Mock.mock('/api/config', 'get', ConfigResult);

/**
 * 请求结果集失败
 */
var counter = 0;
Mock.mock('/api/data-error', () => {
  counter++;
  if (counter % 2) {
    return {
      resultCode: '0003',
      resultData: null,
      resultDesc: '未知的错误 😔'
    };
  } else {
    return DataResult;
  }
});

/**
 * 请求结果集成功
 */
Mock.mock('/api/data', () => {
  const _row = JSON.parse(JSON.stringify(DataResult.resultData.rows[0]));
  _row.id = Date.now();
  _row.name += Date.now();

  DataResult.resultData.rows.splice(1, 1, _row);
  return DataResult;
});
