/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-08-30 17:11:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-30 17:15:18
 */
import { add } from "../src/add.ts";

describe('test add function', () => {
  it('should get 4', () => {
    expect(add(2, 2)).toBe(4)
  });
});