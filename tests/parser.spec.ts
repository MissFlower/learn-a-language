/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 13:55:57
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-07 15:54:40
 */
import { Tokenizer } from "../src/Tokenizer";
import { Token, TokenKind } from "../src/Token";
import { Parser, Prog } from "../src/Parser";
describe('Parser', () => {
  describe('parseFunctionCall', () => {
    it('should get one functionCall', () => {
      const tokens: Token[] = [
        {kind:TokenKind.Identifier, text:'sayHello'},
        {kind:TokenKind.Seperator,  text:'('},
        {kind:TokenKind.Seperator,  text:')'},
        {kind:TokenKind.Seperator,  text:';'},
      ]
      const tokenizer = new Tokenizer(tokens)
      const parser = new Parser(tokenizer)
      const prog:Prog = parser.parseProg()
      expect(prog.stmts.length).toBe(1)
    })
    it('should get on functionDecl and one functionCall', () => {
      const tokens: Token[] = [
        {kind:TokenKind.Keyword,      text:'function'}, 
        {kind:TokenKind.Identifier,   text:'sayHello'},
        {kind:TokenKind.Seperator,    text:'('},
        {kind:TokenKind.Seperator,    text:')'},
        {kind:TokenKind.Seperator,    text:'{'},
        {kind:TokenKind.Identifier,   text:'println'},
        {kind:TokenKind.Seperator,    text:'('},
        {kind:TokenKind.StringLiteral,text:'Hello World!'},
        {kind:TokenKind.Seperator,    text:')'},
        {kind:TokenKind.Seperator,    text:';'},
        {kind:TokenKind.Seperator,    text:'}'},
        {kind:TokenKind.Identifier,   text:'sayHello'},
        {kind:TokenKind.Seperator,    text:'('},
        {kind:TokenKind.Seperator,    text:')'},
        {kind:TokenKind.Seperator,    text:';'},
        {kind:TokenKind.EOF,          text:''}
      ]
      const parser= new Parser(new Tokenizer(tokens))
      const prog:Prog = parser.parseProg()
      expect(prog.stmts.length).toBe(2)
    })
  })
})
