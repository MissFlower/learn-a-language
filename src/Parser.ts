/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-08-31 15:21:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 10:54:49
 */
import { FunctionKind } from './enum';
import { Token, TokenKind } from './Token';
import { Tokenizer } from './Tokenizer';

// 创建基类
abstract class AstNode {
  /**
   * abstract dump
   * 打印对象信息，prefix是前面填充的字符串，通常用于缩进显示
   */
  public abstract dump(prefix:string):void
}

/**
 * 语句
 * 其子类包括函数声明和函数调用
 */
abstract class Statement extends AstNode {
  public type:FunctionKind
  constructor(type:FunctionKind) {
    super()
    this.type = type
  }
}

/**
 * 程序节点 也是AST的根节点
 */
class Prog extends AstNode {
  public stmts: Statement[] //程序中可以包含多个语句

  constructor(stmts:Statement[]) {
    super()
    this.stmts = stmts
  }

  public dump(perfix:string):void {
    console.log(`${perfix}Prog`)
    this.stmts.forEach(s => s.dump(`${perfix}\t`))
  }
}

/**
 * 函数声明节点
 */
class FunctionDecl extends Statement {
  public name:string        //函数名
  public body:FunctionBody  // 函数体

  constructor(name:string, body:FunctionBody) {
    super(FunctionKind.FunctionDecl)
    this.name = name
    this.body = body
  }

  /**
   * dump
   */
  public dump(perfix:string):void {
    console.log(`${perfix}FunctionBody`)
    this.body.dump(`${perfix}\t`)
  }
}

/**
 * 函数体 
 */
class FunctionBody extends Statement {
  public stmts:FunctionCall[]
  constructor(stmts:FunctionCall[]) {
    super(FunctionKind.FunctionBody)
    this.stmts = stmts
  }

  /**
   * dump
   */
  public dump(perfix:string):void {
    console.log(`${perfix}FunctionCall`)
    this.stmts.forEach(s => s.dump(`${perfix}\t`))
  }
}

/**
 * 函数调用
 */
class FunctionCall extends Statement {
  public name:string
  public parameters:string[]
  public definition:FunctionDecl | null = null  //指向函数的声明

  constructor(name:string, parameters:string[]) {
    super(FunctionKind.FunctionCall)
    this.name = name
    this.parameters = parameters
  }

  /**
   * dump
   */
  public dump(perfix:string):void {
    console.log(`${perfix}FunctionCall--${this.name}--${this.definition!==null ? ", resolved" : ", not resolved"}`)
    this.parameters.forEach(s => console.log(`${perfix}\tParameter: ${s}`))
  }
}

// Parser 解析器
class Parser {
  public tokenizer:Tokenizer

  constructor(tokenizer:Tokenizer) {
    this.tokenizer = tokenizer
  }

  /**
   * 解析Prog(程序节点)
   * 语法规则：
   * prog = (functionDecl | functionCall)
   */
  public parseProg():Prog {
    const stmts: Statement[] = []
    let stmt: Statement | null | void = null
    let token = this.tokenizer.peek();
    console.log(token)

    while (token.kind !== TokenKind.EOF) {
      // 每次循环解析一个语句
      // 看看是不是函数声明
      if (token.kind === TokenKind.Keyword && token.text === 'function') {
        stmt = this.parseFunctionDecl()
      }else if (token.kind == TokenKind.Identifier){
        stmt = this.parseFunctionCall();
      }
      
      if (stmt !== null){
        stmts.push(stmt);
        console.log("success");
      }

      token = this.tokenizer.peek();
    }

    return new Prog(stmts)
  }

  /**
   * 解析函数声明
   * 语法规则：
   * functionDecl: "function" Idenifier "("")" functionBody
  */
  public parseFunctionDecl():FunctionDecl | null {
    console.log("in FunctionDecl");
    //跳过关键字'function'
    this.tokenizer.next()

    let t:Token = this.tokenizer.next()
    // 看下一个是不是标识符
    if (t.kind === TokenKind.Identifier) {
      // 读取"("和")"
      const t1 = this.tokenizer.next()
      if (t1.kind === TokenKind.Seperator && t1.text === "(") {
        const t2 = this.tokenizer.next()
        if (t2.kind === TokenKind.Seperator && t2.text === ")") {
          const functionBody = this.parseFunctionBody()
          if (functionBody !== null) {
            // 解析成功 在这里返回
            return new FunctionDecl(t.text, functionBody)
          } else {
            console.warn(`被期望是函数声明 函数名后是一个 ) 然而得到的是  ${t.text}`)
            return null
          }
        }
      } else {
        console.warn(`被期望是函数声明 函数名后是一个 ( 然而得到的是 ${t.text}`)
        return null
      }
    } else {
      console.log(`被期望是一个函数名 然而得到的是 ${t.text}`);
      return null
    }
    
    return null
  }

  /**
   * 解析函数体
   * 语法规则：
   * functionBody: '{' functionCall '}'
  */
  public parseFunctionBody():FunctionBody | null {
    const stmts:FunctionCall[] = []
    let t:Token = this.tokenizer.next()

    if (t.kind === TokenKind.Seperator && t.text === '{') {
      while(this.tokenizer.peek().kind === TokenKind.Identifier){
        let functionCall = this.parseFunctionCall();
        if (functionCall !== null){
            stmts.push(functionCall);
        }else{
            console.log("函数体解析出错！");
            return null;
        }
      }

      t = this.tokenizer.next()
      if (t.kind === TokenKind.Seperator && t.text === '}') {
        return new FunctionBody(stmts)
      } else {
        console.warn(`被期望函数体是以 { 花括号开始 然而却得到 ${t.text}`)
        return null
      }
    } else {
      console.warn(`被期望函数体是以 } 花括号开始 然而却得到 ${t.text}`)
      // 如果解析不成功，回溯，返回null。
      return null
    }
  }

  /**
   * 解析函数调用
   * 语法规则：
   * functionCall: Idenifier '(' parameterList? ')'
   * paramterList: StringLiteral (',' StringLiteral)*
  */
  public parseFunctionCall():FunctionCall | null {
    const params: string[] = []
    const t:Token = this.tokenizer.next()
    if (t.kind === TokenKind.Identifier) {
      let t1:Token = this.tokenizer.next()
      if (t1.kind === TokenKind.Seperator && t1.text === "(") {
        let t2:Token = this.tokenizer.next()
        // 循环读出所有参数
        while (t2.text !== ')') {
          if (t2.kind === TokenKind.StringLiteral) {
            params.push(t2.text)
          } else {
            // 出错时，就不在错误处回溯了。
            console.warn(`被期望函数调用参数是一个字符串 然而得到的是 ${t.text}`)
            return null
          }
          t2 = this.tokenizer.next()
          if (t2.text !== ')') {
            if (t2.kind === TokenKind.Seperator && t2.text === ',' ) {
              t2 = this.tokenizer.next()
            } else {
              console.log(`被期望的是一个逗号分隔符 然而得到的是 ${t2.text}`);
              return null;
            }
          }
        }

        // 消化掉一个分号：;
        t2 = this.tokenizer.next()
        if (t2.kind === TokenKind.Seperator && t2.text === ';') {
          return new FunctionCall(t.text, params)
        } else {
          console.warn(`被期望函数调用以 ; 分号结尾 然而却得到的是 ${t.text}`)
          return null
        }
      } else {
        console.warn(`被期望函数调用是以 ( 括号开始，然而得到的是 ${t.text}`)
        return null
      }
    }
    return null
  }
}

export {
  Parser,
  Prog,
  FunctionDecl,
  FunctionBody,
  FunctionCall
}