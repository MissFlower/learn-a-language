/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-03 14:00:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-07 14:08:33
 */
import { Tokenizer } from '../src/Tokenizer'
import { TokenKind } from '../src/Token'

describe('Tokenizer', () => {
  it('should is "funtion" when first called next', () => {
    const tokens = [{ kind: TokenKind.Keyword, text: 'function' }]
    const tokenizer = new Tokenizer(tokens)
    const { kind, text } = tokenizer.next()

    expect(kind).toBe(TokenKind.Keyword)
    expect(text).toBe('function')
  })

  it('should it-order call next', () => {
    const tokens = [
      { kind: TokenKind.Keyword, text: 'function' },
      { kind: TokenKind.Identifier, text: 'sayHello' },
      { kind: TokenKind.EOF, text: '' }
    ]
    const tokenizer = new Tokenizer(tokens)

    expect(tokenizer.next().text).toBe('function')
    expect(tokenizer.next().text).toBe('sayHello')
    expect(tokenizer.next().text).toBe('')
  })

  it('should "" when last called next follow called next', () => {
    const tokens = [
      { kind: TokenKind.Keyword, text: 'function' },
      { kind: TokenKind.EOF, text: '' }
    ]
    const tokenizer = new Tokenizer(tokens)

    tokenizer.next()
    tokenizer.next()
    tokenizer.next()

    const { kind, text } = tokenizer.next()
    expect(kind).toBe(TokenKind.EOF)
    expect(text).toBe('')
  })
})
