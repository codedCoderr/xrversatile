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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const local_auth_guard_1 = require("../clients/authentication/guards/local-auth.guard");
const constants_1 = require("../constants");
const winston_1 = require("winston");
const lodash_1 = require("lodash");
const decorators_1 = require("../shared/decorators");
const user_dto_1 = require("../user/dto/user.dto");
const response_service_1 = require("../util/response.service");
const jwt_auth_guard_1 = require("../clients/authentication/guards/jwt-auth.guard");
const dto_1 = require("../uploader/dto");
const account_service_1 = require("./account.service");
let AccountController = class AccountController {
    constructor(logger, accountService, responseService) {
        this.accountService = accountService;
        this.responseService = responseService;
        this.logger = logger.child({
            context: {
                service: 'AccountController',
                module: 'Account',
            },
        });
    }
    async createAdmin(res, body, user) {
        try {
            const payload = await this.accountService.createAdmin(body, user, this.logger);
            return this.responseService.json(res, 200, 'Admin created successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue creating admin ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async login(res, user) {
        try {
            const payload = await this.accountService.login(user, this.logger);
            return this.responseService.json(res, 200, 'Login was successful', payload);
        }
        catch (e) {
            this.logger.error(`issue logging in ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async getLoggedInAdmin(res, user) {
        try {
            const payload = await this.accountService.getLoggedInAdmin(user, this.logger);
            return this.responseService.json(res, 200, 'Loggged in admin details was fetched successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue fetching logged in admin's details ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async getAdmins(res, input) {
        try {
            const { perPage, page } = input;
            const payload = await this.accountService.getAdmins(this.logger, page, perPage);
            return this.responseService.json(res, 200, 'Admins fetched successfully', payload.data, payload.metadata);
        }
        catch (e) {
            this.logger.error(`issue fetching admins ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async updateProfile(res, user, body) {
        try {
            const payload = await this.accountService.updateProfile(user, body, this.logger);
            return this.responseService.json(res, 200, 'User profile was updated successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue updating user profile ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async updateAdmin(res, currentUser, body, param) {
        try {
            const user = (0, lodash_1.clone)(currentUser);
            const payload = await this.accountService.updateAdmin(user, param.id, body, this.logger);
            return this.responseService.json(res, 200, 'Admin detail was updated successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue updating admin details ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async deleteAdmin(res, param, currentUser) {
        try {
            const user = (0, lodash_1.clone)(currentUser);
            await this.accountService.deleteAdmin(user, param.id, this.logger);
            return this.responseService.json(res, 204, 'Successfully deleted admin');
        }
        catch (e) {
            this.logger.error(`issue deleting admin ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async resetPassword(res, user, body) {
        try {
            const payload = await this.accountService.resetPassword(user, body, this.logger);
            return this.responseService.json(res, 200, payload.message);
        }
        catch (e) {
            this.logger.error(`issue resetting password ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async getStats(res) {
        try {
            const payload = await this.accountService.getStats(this.logger);
            return this.responseService.json(res, 200, 'Dashboard stats fetched successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue fetching dashboard stats ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async getJobEngagementOverview(res) {
        try {
            const payload = await this.accountService.fetchJobEngagementOverview(this.logger);
            return this.responseService.json(res, 200, 'Job engagement overview was fetched successfully', payload);
        }
        catch (e) {
            this.logger.error(`issue fetching job engagement overview ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
    async uploadProfileImage(res, body) {
        try {
            const payload = await this.accountService.uploadFile(body);
            return this.responseService.json(res, 200, payload);
        }
        catch (e) {
            this.logger.error(`issue uploading profile image ${e.message}`);
            return this.responseService.json(res, e);
        }
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/create-admin'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.CreateUserDTO, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getLoggedInAdmin", null);
__decorate([
    (0, common_1.Get)('/admins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getAdmins", null);
__decorate([
    (0, common_1.Put)('/user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('/admin/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/admin/:id/delete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteAdmin", null);
__decorate([
    (0, common_1.Put)('/reset-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_dto_1.ResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('/job-engagement-overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getJobEngagementOverview", null);
__decorate([
    (0, common_1.Post)('/profile-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.FileUploadDTO]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "uploadProfileImage", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('account'),
    __param(0, (0, common_1.Inject)(constants_1.LOGGER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        account_service_1.AccountService,
        response_service_1.ResponseService])
], AccountController);
//# sourceMappingURL=account.controller.js.map