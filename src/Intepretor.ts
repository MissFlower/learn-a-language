/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 18:01:01
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 13:22:04
 */
import { AstVisitor } from "./AstVisitor";
import { FunctionKind, SystemKeyword } from "./enum";
import { FunctionBody, FunctionCall, Prog } from "./Parser";

export class Intepretor extends AstVisitor {
  visitProg(prog:Prog) {
    prog.stmts.forEach(stmt => {
      if (stmt.type === FunctionKind.FunctionCall) {
        this.runFunction(stmt as FunctionCall)
      }
    })
  }

  visitFunctionBody(functionBody:FunctionBody) {
    functionBody.stmts.forEach(stmt => this.runFunction(stmt))
  }

  runFunction(functionCall:FunctionCall) {
    if (functionCall.name === SystemKeyword.println) {
      if (functionCall.parameters.length > 0) {
        console.log(...functionCall.parameters);
      }
    } else {
      // 找到函数定义 继续遍历函数体
      if (functionCall.definition !== null) {
        this.visitFunctionBody(functionCall.definition.body)
      }
    }
  }
}