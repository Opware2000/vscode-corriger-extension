"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
const user_factory_1 = require("./factories/user-factory");
exports.test = test_1.test.extend({
    userFactory: async ({}, use) => {
        const factory = new user_factory_1.UserFactory();
        await use(factory);
        await factory.cleanup(); // Auto-cleanup
    },
});
var test_2 = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return test_2.expect; } });
//# sourceMappingURL=index.js.map