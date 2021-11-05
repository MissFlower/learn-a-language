"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 17:46:55
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-07 17:57:27
 */
var AstVisitor_1 = require("../src/AstVisitor");
var Token_1 = require("../src/Token");
var Tokenizer_1 = require("../src/Tokenizer");
var Parser_1 = require("../src/Parser");
describe('RefResolver', function () {
    it('should get on functionDecl and one functionCall', function () {
        var tokens = [
            { kind: Token_1.TokenKind.Keyword, text: 'function' },
            { kind: Token_1.TokenKind.Identifier, text: 'sayHello' },
            { kind: Token_1.TokenKind.Seperator, text: '(' },
            { kind: Token_1.TokenKind.Seperator, text: ')' },
            { kind: Token_1.TokenKind.Seperator, text: '{' },
            { kind: Token_1.TokenKind.Identifier, text: 'println' },
            { kind: Token_1.TokenKind.Seperator, text: '(' },
            { kind: Token_1.TokenKind.StringLiteral, text: 'Hello World!' },
            { kind: Token_1.TokenKind.Seperator, text: ')' },
            { kind: Token_1.TokenKind.Seperator, text: ';' },
            { kind: Token_1.TokenKind.Seperator, text: '}' },
            { kind: Token_1.TokenKind.Identifier, text: 'sayHello' },
            { kind: Token_1.TokenKind.Seperator, text: '(' },
            { kind: Token_1.TokenKind.Seperator, text: ')' },
            { kind: Token_1.TokenKind.Seperator, text: ';' },
            { kind: Token_1.TokenKind.EOF, text: '' }
        ];
        var parser = new Parser_1.Parser(new Tokenizer_1.Tokenizer(tokens));
        var prog = parser.parseProg();
        new AstVisitor_1.RefResolver().visitProg(prog);
        expect(prog.stmts.length).toBe(2);
    });
});
