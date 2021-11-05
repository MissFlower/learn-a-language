/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 18:10:51
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 14:43:15
 */
import { Tokenizer } from './Tokenizer';
import { Parser, Prog } from "./Parser";
import { Intepretor } from "./Intepretor";
import { RefResolver } from "./AstVisitor";
import { CharStream } from "./CharStream";

// 编译 运行程序
const program = `function sayHello(){
	println("Hello","World!");
    } 

    sayHello();
    `
function compileAndRun() {
  console.log('----开始解析----')
  // 解析词法
  const tokenizer = new Tokenizer(new CharStream(program))
  // 语法解析
  const prog:Prog = new Parser(tokenizer).parseProg()
  new RefResolver().visitProg(prog)
  // console.log(prog)
  // 语义分析
  new Intepretor().visitProg(prog)
  console.log('----完成----')
}
compileAndRun()