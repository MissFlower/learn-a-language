/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-08-30 17:07:19
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-30 17:07:36
 */
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};