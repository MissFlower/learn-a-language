(function () {
    'use strict';

    /*
     * @Description:
     * @Version: 0.1.0
     * @Author: AiDongYang
     * @Date: 2021-08-31 14:58:12
     * @LastEditors: AiDongYang
     * @LastEditTime: 2021-09-08 18:10:21
     */
    // Token类型
    var TokenKind;
    (function (TokenKind) {
        TokenKind[TokenKind["Keyword"] = 0] = "Keyword";
        TokenKind[TokenKind["Identifier"] = 1] = "Identifier";
        TokenKind[TokenKind["StringLiteral"] = 2] = "StringLiteral";
        TokenKind[TokenKind["Seperator"] = 3] = "Seperator";
        TokenKind[TokenKind["Operator"] = 4] = "Operator";
        TokenKind[TokenKind["EOF"] = 5] = "EOF";
    })(TokenKind || (TokenKind = {}));
    [
        { kind: TokenKind.Keyword, text: 'function' },
        { kind: TokenKind.Identifier, text: 'sayHello' },
        { kind: TokenKind.Seperator, text: '(' },
        { kind: TokenKind.Seperator, text: ')' },
        { kind: TokenKind.Seperator, text: '{' },
        { kind: TokenKind.Identifier, text: 'println' },
        { kind: TokenKind.Seperator, text: '(' },
        { kind: TokenKind.StringLiteral, text: 'Hello World!' },
        { kind: TokenKind.Seperator, text: ')' },
        { kind: TokenKind.Seperator, text: ';' },
        { kind: TokenKind.Seperator, text: '}' },
        { kind: TokenKind.Identifier, text: 'sayHello' },
        { kind: TokenKind.Seperator, text: '(' },
        { kind: TokenKind.Seperator, text: ')' },
        { kind: TokenKind.Seperator, text: ';' },
        { kind: TokenKind.EOF, text: '' }
    ];

    /*
     * @Description:
     * @Version: 0.1.0
     * @Author: AiDongYang
     * @Date: 2021-09-07 16:29:11
     * @LastEditors: AiDongYang
     * @LastEditTime: 2021-09-08 16:05:59
     */
    var FunctionKind;
    (function (FunctionKind) {
        FunctionKind[FunctionKind["FunctionDecl"] = 0] = "FunctionDecl";
        FunctionKind[FunctionKind["FunctionBody"] = 1] = "FunctionBody";
        FunctionKind[FunctionKind["FunctionCall"] = 2] = "FunctionCall";
    })(FunctionKind || (FunctionKind = {}));
    var SystemKeyword;
    (function (SystemKeyword) {
        SystemKeyword["println"] = "println";
        SystemKeyword["function"] = "function";
    })(SystemKeyword || (SystemKeyword = {}));

    /*
     * @Description:
     * @Version: 0.1.0
     * @Author: AiDongYang
     * @Date: 2021-08-31 14:56:24
     * @LastEditors: AiDongYang
     * @LastEditTime: 2021-09-09 10:36:57
     */
    // export class Tokenizer {
    //   private tokens: Token[]
    //   private pos:number = 0
    //   constructor(tokens: Token[]) {
    //     this.tokens = tokens
    //   }
    //   next(): Token {
    //     if (this.pos < this.tokens.length) {
    //       return this.tokens[this.pos++]
    //     } else {
    //       // 到了末尾 总是返回EOF
    //       return this.tokens[this.tokens.length - 1]
    //     }
    //   }
    //   position(): number {
    //     return this.pos
    //   }
    //   traceBack(newPos: number): void {
    //     this.pos = newPos
    //   }
    // }
    var Tokenizer = /** @class */ (function () {
        function Tokenizer(stream) {
            this.nextToken = { kind: TokenKind.EOF, text: '' };
            this.stream = stream;
        }
        Tokenizer.prototype.next = function () {
            //在第一次的时候，先parse一个Token
            if (this.nextToken.kind === TokenKind.EOF && !this.stream.eof()) {
                this.nextToken = this.getAToken();
            }
            var lastToken = this.nextToken;
            this.nextToken = this.getAToken();
            return lastToken;
        };
        Tokenizer.prototype.peek = function () {
            if (this.nextToken.kind === TokenKind.EOF && !this.stream.eof()) {
                this.nextToken = this.getAToken();
            }
            return this.nextToken;
        };
        // 从字符串流中获取一个新Token。
        Tokenizer.prototype.getAToken = function () {
            // 先跳过空白符
            this.skipWhiteSpaces();
            if (this.stream.eof()) {
                return { kind: TokenKind.EOF, text: '' };
            }
            else {
                var ch = this.stream.peek();
                // 看看是否是字母或这数字
                if (this.isLetter(ch) || this.isDigit(ch)) {
                    // 解析标识符
                    return this.parseIdentifer();
                }
                else if (ch === '"') {
                    // 解析字符串
                    return this.parseStringLiteral();
                }
                else if (ch === '(' ||
                    ch === ')' ||
                    ch === '{' ||
                    ch === '}' ||
                    ch === ';' ||
                    ch === ',') {
                    // 分隔符
                    return this.parseSeperator();
                }
                else if (ch === '/') {
                    this.stream.next();
                    var ch_1 = this.stream.peek();
                    if (ch_1 === '*') {
                        this.skipMultipleLineComments();
                        // 继续执行
                        return this.getAToken();
                    }
                    else if (ch_1 === '/') {
                        this.skipSingleLineComment();
                        // 继续执行
                        return this.getAToken();
                    }
                    else if (ch_1 === '=') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '/=' };
                    }
                    else {
                        return { kind: TokenKind.Operator, text: '/' };
                    }
                }
                else if (ch === '+') {
                    this.stream.next();
                    var ch_2 = this.stream.peek();
                    if (ch_2 === '+') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '++' };
                    }
                    else if (ch_2 === '=') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '+=' };
                    }
                    else {
                        return { kind: TokenKind.Operator, text: '+' };
                    }
                }
                else if (ch === '-') {
                    this.stream.next();
                    var ch_3 = this.stream.peek();
                    if (ch_3 === '-') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '--' };
                    }
                    else if (ch_3 === '=') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '-=' };
                    }
                    else {
                        return { kind: TokenKind.Operator, text: '-' };
                    }
                }
                else if (ch === '*') {
                    this.stream.next();
                    var ch_4 = this.stream.peek();
                    if (ch_4 === '*') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '**' };
                    }
                    else if (ch_4 === '=') {
                        this.stream.next();
                        return { kind: TokenKind.Operator, text: '*=' };
                    }
                    else {
                        return { kind: TokenKind.Operator, text: '*' };
                    }
                }
                else {
                    // 暂时去掉不能识别的字符
                    console.log("Unrecognized pattern meeting ': " + ch + "', at" + this.stream.line + " col: " + this.stream.col);
                    this.stream.next();
                    return this.getAToken();
                }
            }
        };
        /**
         * 解析标识符 并从标识符中挑出关键字
         */
        Tokenizer.prototype.parseIdentifer = function () {
            var token = { kind: TokenKind.Identifier, text: '' };
            // 第一个字符不用判断 因为在调用者那边已经判断了
            token.text += this.stream.peek();
            // 读取下一个字符
            this.stream.next();
            while (this.isLetterDigitOrUnderLine(this.stream.peek()) && !this.stream.eof()) {
                token.text += this.stream.next();
            }
            // 识别关键字
            if (token.text === SystemKeyword.function) {
                token.kind = TokenKind.Keyword;
            }
            return token;
        };
        /**
         * 解析字符串字面量 并收集字符串
         * 目前只支持双引号 并且不支持转义
        */
        Tokenizer.prototype.parseStringLiteral = function () {
            var token = { kind: TokenKind.StringLiteral, text: '' };
            // 第一个字段不用判断 也不需要添加 就是"
            this.stream.next();
            while (!this.stream.eof() && this.stream.peek() !== '"') {
                token.text += this.stream.next();
            }
            if (this.stream.peek() !== '"') {
                console.log("Expecting an \" at line: " + this.stream.line + " col: " + this.stream.col);
            }
            else {
                //消化掉字符换末尾的引号
                this.stream.next();
                console.log('parseStringLiteral解析成功');
            }
            return token;
        };
        /**
         * 解析分隔符
         */
        Tokenizer.prototype.parseSeperator = function () {
            var ch = this.stream.peek();
            this.stream.next();
            return { kind: TokenKind.Seperator, text: ch };
        };
        /**
         * 跳过空白符
        */
        Tokenizer.prototype.skipWhiteSpaces = function () {
            while (this.isWhiteSpaces(this.stream.peek())) {
                this.stream.next();
            }
        };
        /**
         * 是否是空白符
        */
        Tokenizer.prototype.isWhiteSpaces = function (ch) {
            return ch === ' ' || ch === '\n' || ch === '\t';
        };
        /**
         * 是否是字母
        */
        Tokenizer.prototype.isLetter = function (ch) {
            return /[a-zA-Z]/.test(ch);
        };
        /**
         * 是否是数字
        */
        Tokenizer.prototype.isDigit = function (ch) {
            return /[0-9]/.test(ch);
        };
        /**
         * 是否是字母数字下划线
        */
        Tokenizer.prototype.isLetterDigitOrUnderLine = function (ch) {
            return this.isLetter(ch) || this.isDigit(ch) || ch === '_';
        };
        /**
         * 跳过多行注释
        */
        Tokenizer.prototype.skipMultipleLineComments = function () {
            // / * 之前已经跳过去了
            this.stream.next();
            if (!this.stream.eof()) {
                var ch1 = this.stream.next();
                // 如果不是结束 一直找eof
                while (!this.stream.eof()) {
                    var ch2 = this.stream.next();
                    if (ch1 === '*' && ch2 === '/') {
                        // 结束
                        return;
                    }
                    ch1 = ch2;
                }
            }
            // 如果没有匹配上，报错。
            console.warn("Failed to find matching */ for multiple line comments at ': " + this.stream.line + " col: " + this.stream.col);
        };
        /**
         * 跳过单行注释
        */
        Tokenizer.prototype.skipSingleLineComment = function () {
            //  //之前已经跳过了
            this.stream.next();
            // 往后一直找到回车或者eof
            while (!this.stream.eof() && this.stream.peek() !== '\n') {
                this.stream.next();
            }
        };
        return Tokenizer;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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
    /**
     * 函数声明节点
     */
    var FunctionDecl = /** @class */ (function (_super) {
        __extends(FunctionDecl, _super);
        function FunctionDecl(name, body) {
            var _this = _super.call(this, FunctionKind.FunctionDecl) || this;
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
    /**
     * 函数体
     */
    var FunctionBody = /** @class */ (function (_super) {
        __extends(FunctionBody, _super);
        function FunctionBody(stmts) {
            var _this = _super.call(this, FunctionKind.FunctionBody) || this;
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
    /**
     * 函数调用
     */
    var FunctionCall = /** @class */ (function (_super) {
        __extends(FunctionCall, _super);
        function FunctionCall(name, parameters) {
            var _this = _super.call(this, FunctionKind.FunctionCall) || this;
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
            while (token.kind !== TokenKind.EOF) {
                // 每次循环解析一个语句
                // 看看是不是函数声明
                if (token.kind === TokenKind.Keyword && token.text === 'function') {
                    stmt = this.parseFunctionDecl();
                }
                else if (token.kind == TokenKind.Identifier) {
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
            if (t.kind === TokenKind.Identifier) {
                // 读取"("和")"
                var t1 = this.tokenizer.next();
                if (t1.kind === TokenKind.Seperator && t1.text === "(") {
                    var t2 = this.tokenizer.next();
                    if (t2.kind === TokenKind.Seperator && t2.text === ")") {
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
            if (t.kind === TokenKind.Seperator && t.text === '{') {
                while (this.tokenizer.peek().kind === TokenKind.Identifier) {
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
                if (t.kind === TokenKind.Seperator && t.text === '}') {
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
            if (t.kind === TokenKind.Identifier) {
                var t1 = this.tokenizer.next();
                if (t1.kind === TokenKind.Seperator && t1.text === "(") {
                    var t2 = this.tokenizer.next();
                    // 循环读出所有参数
                    while (t2.text !== ')') {
                        if (t2.kind === TokenKind.StringLiteral) {
                            params.push(t2.text);
                        }
                        else {
                            // 出错时，就不在错误处回溯了。
                            console.warn("\u88AB\u671F\u671B\u51FD\u6570\u8C03\u7528\u53C2\u6570\u662F\u4E00\u4E2A\u5B57\u7B26\u4E32 \u7136\u800C\u5F97\u5230\u7684\u662F " + t.text);
                            return null;
                        }
                        t2 = this.tokenizer.next();
                        if (t2.text !== ')') {
                            if (t2.kind === TokenKind.Seperator && t2.text === ',') {
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
                    if (t2.kind === TokenKind.Seperator && t2.text === ';') {
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

    /*
     * @Description:
     * @Version: 0.1.0
     * @Author: AiDongYang
     * @Date: 2021-09-07 16:06:22
     * @LastEditors: AiDongYang
     * @LastEditTime: 2021-09-07 17:54:24
     */
    /**
     * 对AST做遍历的Vistor。
     * 这是一个基类，定义了缺省的遍历方式。子类可以覆盖某些方法，修改遍历方式。
    */
    var AstVisitor = /** @class */ (function () {
        function AstVisitor() {
        }
        AstVisitor.prototype.visitProg = function (prog) { };
        AstVisitor.prototype.visitFunctionDecl = function (functionDecl) { };
        AstVisitor.prototype.visitFunctionBody = function (functionBody) { };
        AstVisitor.prototype.visitFunctionCall = function (functionCall) { };
        return AstVisitor;
    }());
    /**
     * 语义分析
     * 对函数调用做引用小姐 也就是找到函数的声明
     * 遍历AST 如果发现函数调用 就去找它的定义
    */
    var RefResolver = /** @class */ (function (_super) {
        __extends(RefResolver, _super);
        function RefResolver() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.prog = null;
            return _this;
        }
        RefResolver.prototype.visitProg = function (prog) {
            this.prog = prog;
            for (var _i = 0, _a = prog.stmts; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.type === FunctionKind.FunctionCall) {
                    this.resolveFunctionCall(prog, x);
                }
                else if (x.type === FunctionKind.FunctionDecl) {
                    this.visitFunctionDecl(x);
                }
            }
        };
        RefResolver.prototype.visitFunctionDecl = function (functionDecl) {
            this.visitFunctionBody(functionDecl.body);
        };
        RefResolver.prototype.visitFunctionBody = function (functionBody) {
            var _this = this;
            if (this.prog !== null) {
                functionBody.stmts.forEach(function (stmt) { return _this.resolveFunctionCall(_this.prog, stmt); });
            }
        };
        RefResolver.prototype.resolveFunctionCall = function (prog, functionCall) {
            var functionDecl = this.findFunctionDecl(prog, functionCall.name);
            if (functionDecl !== null) {
                functionCall.definition = functionDecl;
            }
            else if (functionCall.name !== SystemKeyword.println) {
                //系统内置函数不用报错
                console.warn("Error: cannot find definition of function " + functionCall.name);
            }
        };
        RefResolver.prototype.findFunctionDecl = function (prog, name) {
            return prog.stmts.find(function (stmt) { return stmt.type === FunctionKind.FunctionDecl && stmt.name === name; }) || null;
        };
        return RefResolver;
    }(AstVisitor));

    var Intepretor = /** @class */ (function (_super) {
        __extends(Intepretor, _super);
        function Intepretor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Intepretor.prototype.visitProg = function (prog) {
            var _this = this;
            prog.stmts.forEach(function (stmt) {
                if (stmt.type === FunctionKind.FunctionCall) {
                    _this.runFunction(stmt);
                }
            });
        };
        Intepretor.prototype.visitFunctionBody = function (functionBody) {
            var _this = this;
            functionBody.stmts.forEach(function (stmt) { return _this.runFunction(stmt); });
        };
        Intepretor.prototype.runFunction = function (functionCall) {
            if (functionCall.name === SystemKeyword.println) {
                if (functionCall.parameters.length > 0) {
                    console.log.apply(console, functionCall.parameters);
                }
            }
            else {
                // 找到函数定义 继续遍历函数体
                if (functionCall.definition !== null) {
                    this.visitFunctionBody(functionCall.definition.body);
                }
            }
        };
        return Intepretor;
    }(AstVisitor));

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
    var CharStream = /** @class */ (function () {
        function CharStream(data) {
            this.pos = 0;
            this.line = 1;
            this.col = 0;
            this.data = data;
        }
        CharStream.prototype.peek = function () {
            return this.data.charAt(this.pos);
        };
        CharStream.prototype.next = function () {
            var ch = this.data.charAt(this.pos++);
            if (ch === '\n') {
                this.line++;
                this.col = 0;
            }
            else {
                this.col++;
            }
            return ch;
        };
        CharStream.prototype.eof = function () {
            return this.peek() === '';
        };
        return CharStream;
    }());

    /*
     * @Description:
     * @Version: 0.1.0
     * @Author: AiDongYang
     * @Date: 2021-09-07 18:10:51
     * @LastEditors: AiDongYang
     * @LastEditTime: 2021-09-09 14:43:15
     */
    // 编译 运行程序
    var program = "function sayHello(){\n\tprintln(\"Hello\",\"World!\");\n    } \n\n    sayHello();\n    ";
    function compileAndRun() {
        console.log('----开始解析----');
        // 解析词法
        var tokenizer = new Tokenizer(new CharStream(program));
        // 语法解析
        var prog = new Parser(tokenizer).parseProg();
        new RefResolver().visitProg(prog);
        // console.log(prog)
        // 语义分析
        new Intepretor().visitProg(prog);
        console.log('----完成----');
    }
    compileAndRun();

}());
