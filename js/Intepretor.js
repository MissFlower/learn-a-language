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
exports.Intepretor = void 0;
/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-09-07 18:01:01
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-09-09 10:42:15
 */
var AstVisitor_1 = require("./AstVisitor");
var enum_1 = require("./enum");
var Intepretor = /** @class */ (function (_super) {
    __extends(Intepretor, _super);
    function Intepretor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Intepretor.prototype.visitProg = function (prog) {
        var _this = this;
        prog.stmts.forEach(function (stmt) {
            if (stmt.type === enum_1.FunctionKind.FunctionCall) {
                _this.runFunction(stmt);
            }
        });
    };
    Intepretor.prototype.visitFunctionBody = function (functionBody) {
        var _this = this;
        functionBody.stmts.forEach(function (stmt) { return _this.runFunction(stmt); });
    };
    Intepretor.prototype.runFunction = function (functionCall) {
        if (functionCall.name === enum_1.SystemKeyword.println) {
            if (functionCall.parameters.length > 0) {
                console.log(functionCall.parameters);
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
}(AstVisitor_1.AstVisitor));
exports.Intepretor = Intepretor;
