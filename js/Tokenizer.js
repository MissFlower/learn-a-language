"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-08-31 14:56:24
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 10:36:57
 */
var Token_1 = require("./Token");
var enum_1 = require("./enum");
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
        this.nextToken = { kind: Token_1.TokenKind.EOF, text: '' };
        this.stream = stream;
    }
    Tokenizer.prototype.next = function () {
        //在第一次的时候，先parse一个Token
        if (this.nextToken.kind === Token_1.TokenKind.EOF && !this.stream.eof()) {
            this.nextToken = this.getAToken();
        }
        var lastToken = this.nextToken;
        this.nextToken = this.getAToken();
        return lastToken;
    };
    Tokenizer.prototype.peek = function () {
        if (this.nextToken.kind === Token_1.TokenKind.EOF && !this.stream.eof()) {
            this.nextToken = this.getAToken();
        }
        return this.nextToken;
    };
    // 从字符串流中获取一个新Token。
    Tokenizer.prototype.getAToken = function () {
        // 先跳过空白符
        this.skipWhiteSpaces();
        if (this.stream.eof()) {
            return { kind: Token_1.TokenKind.EOF, text: '' };
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
                    return { kind: Token_1.TokenKind.Operator, text: '/=' };
                }
                else {
                    return { kind: Token_1.TokenKind.Operator, text: '/' };
                }
            }
            else if (ch === '+') {
                this.stream.next();
                var ch_2 = this.stream.peek();
                if (ch_2 === '+') {
                    this.stream.next();
                    return { kind: Token_1.TokenKind.Operator, text: '++' };
                }
                else if (ch_2 === '=') {
                    this.stream.next();
                    return { kind: Token_1.TokenKind.Operator, text: '+=' };
                }
                else {
                    return { kind: Token_1.TokenKind.Operator, text: '+' };
                }
            }
            else if (ch === '-') {
                this.stream.next();
                var ch_3 = this.stream.peek();
                if (ch_3 === '-') {
                    this.stream.next();
                    return { kind: Token_1.TokenKind.Operator, text: '--' };
                }
                else if (ch_3 === '=') {
                    this.stream.next();
                    return { kind: Token_1.TokenKind.Operator, text: '-=' };
                }
                else {
                    return { kind: Token_1.TokenKind.Operator, text: '-' };
                }
            }
            else if (ch === '*') {
                this.stream.next();
                var ch_4 = this.stream.peek();
                if (ch_4 === '*') {
                    this.stream.next();
                    return { kind: Token_1.TokenKind.Operator, text: '**' };
                }
                else if (ch_4 === '=') {
                    this.stream.next();
                    return { kind: Token_1.TokenKind.Operator, text: '*=' };
                }
                else {
                    return { kind: Token_1.TokenKind.Operator, text: '*' };
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
        var token = { kind: Token_1.TokenKind.Identifier, text: '' };
        // 第一个字符不用判断 因为在调用者那边已经判断了
        token.text += this.stream.peek();
        // 读取下一个字符
        this.stream.next();
        while (this.isLetterDigitOrUnderLine(this.stream.peek()) && !this.stream.eof()) {
            token.text += this.stream.next();
        }
        // 识别关键字
        if (token.text === enum_1.SystemKeyword.function) {
            token.kind = Token_1.TokenKind.Keyword;
        }
        return token;
    };
    /**
     * 解析字符串字面量 并收集字符串
     * 目前只支持双引号 并且不支持转义
    */
    Tokenizer.prototype.parseStringLiteral = function () {
        var token = { kind: Token_1.TokenKind.StringLiteral, text: '' };
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
        return { kind: Token_1.TokenKind.Seperator, text: ch };
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
exports.Tokenizer = Tokenizer;
