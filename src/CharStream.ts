/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-08 14:31:48
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-08 18:31:04
 */
/**
 * 一个字符串流。其操作为：
 * peek():预读下一个字符，但不移动指针；
 * next():读取下一个字符，并且移动指针；
 * eof():判断是否已经到了结尾。
 */
export class CharStream {
  public data:string
  public pos:number = 0
  public line:number = 1
  public col:number = 0
  constructor(data:string) {
    this.data = data
  }

  peek():string {
    return this.data.charAt(this.pos)
  }

  next():string {
    let ch = this.data.charAt(this.pos++)
    if (ch === '\n') {
      this.line++
      this.col = 0
    } else {
      this.col++
    }

    return ch
  }

  eof():boolean {
    return this.peek() === ''
  }
}