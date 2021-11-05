/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 16:06:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-07 17:54:24
 */

import { FunctionKind, SystemKeyword } from "./enum";
import { FunctionBody, FunctionCall, FunctionDecl, Prog } from "./Parser";

/**
 * 对AST做遍历的Vistor。
 * 这是一个基类，定义了缺省的遍历方式。子类可以覆盖某些方法，修改遍历方式。
*/
export abstract class AstVisitor {
  visitProg(prog: Prog) {}
  visitFunctionDecl(functionDecl:FunctionDecl) {}
  visitFunctionBody(functionBody:FunctionBody) {}
  visitFunctionCall(functionCall:FunctionCall) {}
}

/**
 * 语义分析
 * 对函数调用做引用小姐 也就是找到函数的声明
 * 遍历AST 如果发现函数调用 就去找它的定义
*/
export class RefResolver extends AstVisitor {
  public prog:Prog|null = null
  visitProg(prog:Prog) {
    this.prog = prog
    for (const x of prog.stmts) {
      if (x.type === FunctionKind.FunctionCall) {
        this.resolveFunctionCall(prog, x as FunctionCall)
      } else if(x.type === FunctionKind.FunctionDecl) {
        this.visitFunctionDecl(x as FunctionDecl)
      }
    }
  }

  visitFunctionDecl(functionDecl:FunctionDecl) {
    this.visitFunctionBody(functionDecl.body)
  }

  visitFunctionBody(functionBody:FunctionBody) {
    if (this.prog !== null) {
      functionBody.stmts.forEach(stmt => this.resolveFunctionCall(this.prog!, stmt))
    }
  }

  private resolveFunctionCall(prog:Prog, functionCall:FunctionCall) {
    const functionDecl = this.findFunctionDecl(prog, functionCall.name)
    if (functionDecl !== null) {
      functionCall.definition = functionDecl
    } else if (functionCall.name !== SystemKeyword.println) {
      //系统内置函数不用报错
      console.warn("Error: cannot find definition of function " + functionCall.name)
    }
  }

  private findFunctionDecl(prog:Prog, name:string):FunctionDecl|null {
    return prog.stmts.find(stmt => stmt.type === FunctionKind.FunctionDecl && (stmt as FunctionDecl).name === name) as FunctionDecl || null
  }
}