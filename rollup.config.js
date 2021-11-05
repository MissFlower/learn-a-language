/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-09 13:24:39
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 14:54:15
 */
// rollup.config.js\
import typescript from '@rollup/plugin-typescript'
export default {
  input: 'src/main.ts',
  output: {
    name: 'library',
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [typescript()]
}
