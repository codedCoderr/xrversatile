"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const logger_1 = require("../logger");
const util_service_1 = require("../util/util.service");
const account_service_1 = require("./account.service");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(accountService, utilService, logger) {
        super();
        this.accountService = accountService;
        this.utilService = utilService;
        this.logger = logger;
    }
    async validate(username, password) {
        this.logger.info('validating user credentials');
        const user = await this.accountService.validateUser(this.utilService.trimAndLowerCase(username), password, this.logger);
        if (!user) {
            this.logger.info('invalid user credentials');
            throw new common_1.UnauthorizedException();
        }
        this.logger.info('valid user credentials');
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        util_service_1.UtilService,
        logger_1.Logger])
], LocalStrategy);
//# sourceMappingURL=local.strategy.js.map