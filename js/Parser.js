"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCall = exports.FunctionBody = exports.FunctionDecl = exports.Prog = exports.Parser = void 0;
/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-08-31 15:21:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 10:54:49
 */
var enum_1 = require("./enum");
var Token_1 = require("./Token");
// 创建基类
var AstNode = /** @class */ (function () {
    function AstNode() {
    }
    return AstNode;
}());
/**
 * 语句
 * 其子类包括函数声明和函数调用
 */
var Statement = /** @class */ (function (_super) {
    __extends(Statement, _super);
    function Statement(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        return _this;
    }
    return Statement;
}(AstNode));
/**
 * 程序节点 也是AST的根节点
 */
var Prog = /** @class */ (function (_super) {
    __extends(Prog, _super);
    function Prog(stmts) {
        var _this = _super.call(this) || this;
        _this.stmts = stmts;
        return _this;
    }
    Prog.prototype.dump = function (perfix) {
        console.log(perfix + "Prog");
        this.stmts.forEach(function (s) { return s.dump(perfix + "\t"); });
    };
    return Prog;
}(AstNode));
exports.Prog = Prog;
/**
 * 函数声明节点
 */
var FunctionDecl = /** @class */ (function (_super) {
    __extends(FunctionDecl, _super);
    function FunctionDecl(name, body) {
        var _this = _super.call(this, enum_1.FunctionKind.FunctionDecl) || this;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    /**
     * dump
     */
    FunctionDecl.prototype.dump = function (perfix) {
        console.log(perfix + "FunctionBody");
        this.body.dump(perfix + "\t");
    };
    return FunctionDecl;
}(Statement));
exports.FunctionDecl = FunctionDecl;
/**
 * 函数体
 */
var FunctionBody = /** @class */ (function (_super) {
    __extends(FunctionBody, _super);
    function FunctionBody(stmts) {
        var _this = _super.call(this, enum_1.FunctionKind.FunctionBody) || this;
        _this.stmts = stmts;
        return _this;
    }
    /**
     * dump
     */
    FunctionBody.prototype.dump = function (perfix) {
        console.log(perfix + "FunctionCall");
        this.stmts.forEach(function (s) { return s.dump(perfix + "\t"); });
    };
    return FunctionBody;
}(Statement));
exports.FunctionBody = FunctionBody;
/**
 * 函数调用
 */
var FunctionCall = /** @class */ (function (_super) {
    __extends(FunctionCall, _super);
    function FunctionCall(name, parameters) {
        var _this = _super.call(this, enum_1.FunctionKind.FunctionCall) || this;
        _this.definition = null; //指向函数的声明
        _this.name = name;
        _this.parameters = parameters;
        return _this;
    }
    /**
     * dump
     */
    FunctionCall.prototype.dump = function (perfix) {
        console.log(perfix + "FunctionCall--" + this.name + "--" + (this.definition !== null ? ", resolved" : ", not resolved"));
        this.parameters.forEach(function (s) { return console.log(perfix + "\tParameter: " + s); });
    };
    return FunctionCall;
}(Statement));
exports.FunctionCall = FunctionCall;
// Parser 解析器
var Parser = /** @class */ (function () {
    function Parser(tokenizer) {
        this.tokenizer = tokenizer;
    }
    /**
     * 解析Prog(程序节点)
     * 语法规则：
     * prog = (functionDecl | functionCall)
     */
    Parser.prototype.parseProg = function () {
        var stmts = [];
        var stmt = null;
        var token = this.tokenizer.peek();
        console.log(token);
        while (token.kind !== Token_1.TokenKind.EOF) {
            // 每次循环解析一个语句
            // 看看是不是函数声明
            if (token.kind === Token_1.TokenKind.Keyword && token.text === 'function') {
                stmt = this.parseFunctionDecl();
            }
            else if (token.kind == Token_1.TokenKind.Identifier) {
                stmt = this.parseFunctionCall();
            }
            if (stmt !== null) {
                stmts.push(stmt);
                console.log("success");
            }
            token = this.tokenizer.peek();
        }
        return new Prog(stmts);
    };
    /**
     * 解析函数声明
     * 语法规则：
     * functionDecl: "function" Idenifier "("")" functionBody
    */
    Parser.prototype.parseFunctionDecl = function () {
        console.log("in FunctionDecl");
        //跳过关键字'function'
        this.tokenizer.next();
        var t = this.tokenizer.next();
        // 看下一个是不是标识符
        if (t.kind === Token_1.TokenKind.Identifier) {
            // 读取"("和")"
            var t1 = this.tokenizer.next();
            if (t1.kind === Token_1.TokenKind.Seperator && t1.text === "(") {
                var t2 = this.tokenizer.next();
                if (t2.kind === Token_1.TokenKind.Seperator && t2.text === ")") {
                    var functionBody = this.parseFunctionBody();
                    if (functionBody !== null) {
                        // 解析成功 在这里返回
                        return new FunctionDecl(t.text, functionBody);
                    }
                    else {
                        console.warn("\u88AB\u671F\u671B\u662F\u51FD\u6570\u58F0\u660E \u51FD\u6570\u540D\u540E\u662F\u4E00\u4E2A ) \u7136\u800C\u5F97\u5230\u7684\u662F  " + t.text);
                        return null;
                    }
                }
            }
            else {
                console.warn("\u88AB\u671F\u671B\u662F\u51FD\u6570\u58F0\u660E \u51FD\u6570\u540D\u540E\u662F\u4E00\u4E2A ( \u7136\u800C\u5F97\u5230\u7684\u662F " + t.text);
                return null;
            }
        }
        else {
            console.log("\u88AB\u671F\u671B\u662F\u4E00\u4E2A\u51FD\u6570\u540D \u7136\u800C\u5F97\u5230\u7684\u662F " + t.text);
            return null;
        }
        return null;
    };
    /**
     * 解析函数体
     * 语法规则：
     * functionBody: '{' functionCall '}'
    */
    Parser.prototype.parseFunctionBody = function () {
        var stmts = [];
        var t = this.tokenizer.next();
        if (t.kind === Token_1.TokenKind.Seperator && t.text === '{') {
            while (this.tokenizer.peek().kind === Token_1.TokenKind.Identifier) {
                var functionCall = this.parseFunctionCall();
                if (functionCall !== null) {
                    stmts.push(functionCall);
                }
                else {
                    console.log("函数体解析出错！");
                    return null;
                }
            }
            t = this.tokenizer.next();
            if (t.kind === Token_1.TokenKind.Seperator && t.text === '}') {
                return new FunctionBody(stmts);
            }
            else {
                console.warn("\u88AB\u671F\u671B\u51FD\u6570\u4F53\u662F\u4EE5 { \u82B1\u62EC\u53F7\u5F00\u59CB \u7136\u800C\u5374\u5F97\u5230 " + t.text);
                return null;
            }
        }
        else {
            console.warn("\u88AB\u671F\u671B\u51FD\u6570\u4F53\u662F\u4EE5 } \u82B1\u62EC\u53F7\u5F00\u59CB \u7136\u800C\u5374\u5F97\u5230 " + t.text);
            // 如果解析不成功，回溯，返回null。
            return null;
        }
    };
    /**
     * 解析函数调用
     * 语法规则：
     * functionCall: Idenifier '(' parameterList? ')'
     * paramterList: StringLiteral (',' StringLiteral)*
    */
    Parser.prototype.parseFunctionCall = function () {
        var params = [];
        var t = this.tokenizer.next();
        if (t.kind === Token_1.TokenKind.Identifier) {
            var t1 = this.tokenizer.next();
            if (t1.kind === Token_1.TokenKind.Seperator && t1.text === "(") {
                var t2 = this.tokenizer.next();
                // 循环读出所有参数
                while (t2.text !== ')') {
                    if (t2.kind === Token_1.TokenKind.StringLiteral) {
                        params.push(t2.text);
                    }
                    else {
                        // 出错时，就不在错误处回溯了。
                        console.warn("\u88AB\u671F\u671B\u51FD\u6570\u8C03\u7528\u53C2\u6570\u662F\u4E00\u4E2A\u5B57\u7B26\u4E32 \u7136\u800C\u5F97\u5230\u7684\u662F " + t.text);
                        return null;
                    }
                    t2 = this.tokenizer.next();
                    if (t2.text !== ')') {
                        if (t2.kind === Token_1.TokenKind.Seperator && t2.text === ',') {
                            t2 = this.tokenizer.next();
                        }
                        else {
                            console.log("\u88AB\u671F\u671B\u7684\u662F\u4E00\u4E2A\u9017\u53F7\u5206\u9694\u7B26 \u7136\u800C\u5F97\u5230\u7684\u662F " + t2.text);
                            return null;
                        }
                    }
                }
                // 消化掉一个分号：;
                t2 = this.tokenizer.next();
                if (t2.kind === Token_1.TokenKind.Seperator && t2.text === ';') {
                    return new FunctionCall(t.text, params);
                }
                else {
                    console.warn("\u88AB\u671F\u671B\u51FD\u6570\u8C03\u7528\u4EE5 ; \u5206\u53F7\u7ED3\u5C3E \u7136\u800C\u5374\u5F97\u5230\u7684\u662F " + t.text);
                    return null;
                }
            }
            else {
                console.warn("\u88AB\u671F\u671B\u51FD\u6570\u8C03\u7528\u662F\u4EE5 ( \u62EC\u53F7\u5F00\u59CB\uFF0C\u7136\u800C\u5F97\u5230\u7684\u662F " + t.text);
                return null;
            }
        }
        return null;
    };
    return Parser;
}());
exports.Parser = Parser;
