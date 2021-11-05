"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 18:10:51
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 13:17:22
 */
var Tokenizer_1 = require("./Tokenizer");
var Parser_1 = require("./Parser");
var Intepretor_1 = require("./Intepretor");
var AstVisitor_1 = require("./AstVisitor");
var CharStream_1 = require("./CharStream");
// 编译 运行程序
var program = "function sayHello(){\n\tprintln(\"Hello\",\"World!\");\n    } \n\n    sayHello();\n    ";
function compileAndRun() {
    console.log('----开始解析----');
    // 解析词法
    var tokenizer = new Tokenizer_1.Tokenizer(new CharStream_1.CharStream(program));
    // 语法解析
    var prog = new Parser_1.Parser(tokenizer).parseProg();
    new AstVisitor_1.RefResolver().visitProg(prog);
    // console.log(prog)
    // 语义分析
    new Intepretor_1.Intepretor().visitProg(prog);
    console.log('----完成----');
}
compileAndRun();
