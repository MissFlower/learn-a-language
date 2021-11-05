"use strict";
/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 16:06:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-07 17:54:24
 */
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
exports.RefResolver = exports.AstVisitor = void 0;
var enum_1 = require("./enum");
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
exports.AstVisitor = AstVisitor;
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
            if (x.type === enum_1.FunctionKind.FunctionCall) {
                this.resolveFunctionCall(prog, x);
            }
            else if (x.type === enum_1.FunctionKind.FunctionDecl) {
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
        else if (functionCall.name !== enum_1.SystemKeyword.println) {
            //系统内置函数不用报错
            console.warn("Error: cannot find definition of function " + functionCall.name);
        }
    };
    RefResolver.prototype.findFunctionDecl = function (prog, name) {
        return prog.stmts.find(function (stmt) { return stmt.type === enum_1.FunctionKind.FunctionDecl && stmt.name === name; }) || null;
    };
    return RefResolver;
}(AstVisitor));
exports.RefResolver = RefResolver;
