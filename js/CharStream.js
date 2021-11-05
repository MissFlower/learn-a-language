"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharStream = void 0;
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
exports.CharStream = CharStream;
