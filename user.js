"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 👇️ const data: GetUsersResponse
            const { data, status } = yield axios_1.default.get('https://reqres.in/api/users', {
                headers: {
                    Accept: 'application/json',
                },
            });
            console.log(JSON.stringify(data, null, 4));
            // 👇️ "response status is: 200"
            console.log('response status is: ', status);
            return data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message;
            }
            else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    });
}
getUsers();
