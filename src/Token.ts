/*
 * @Description: 
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-08-31 14:58:12
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-08 18:10:21
 */
// Token类型
export enum TokenKind {
  Keyword,
  Identifier,
  StringLiteral,
  Seperator,
  Operator,
  EOF
}

// 一个token的数据结构
export interface Token {
  kind: TokenKind;
  text: string;
}

export const tokenArray: Token[] = [
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
];