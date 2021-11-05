/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-08 17:59:54
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 10:43:01
 */
import { Tokenizer } from '../src/Tokenizer';
import { Parser, Prog } from "../src/Parser";
import { Intepretor } from "../src/Intepretor";
import { RefResolver } from "../src/AstVisitor";
import { CharStream } from "../src/CharStream";
describe('main', () => {
  it('should ', () => {
    const program = `function sayHello(){
      println("Hello","World!");
        } 
    sayHello();
        `
         // 解析词法
    const tokenizer = new Tokenizer(new CharStream(program))
    // 语法解析
    const prog:Prog = new Parser(tokenizer).parseProg()
    new RefResolver().visitProg(prog)
    console.log(prog)
    // 语义分析
    new Intepretor().visitProg(prog)
  });
});