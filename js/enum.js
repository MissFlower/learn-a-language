"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemKeyword = exports.FunctionKind = void 0;
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
})(FunctionKind = exports.FunctionKind || (exports.FunctionKind = {}));
var SystemKeyword;
(function (SystemKeyword) {
    SystemKeyword["println"] = "println";
    SystemKeyword["function"] = "function";
})(SystemKeyword = exports.SystemKeyword || (exports.SystemKeyword = {}));
