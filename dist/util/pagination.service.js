"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = exports.PaginationMetaData = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
class PaginationMetaData {
}
exports.PaginationMetaData = PaginationMetaData;
let PaginationService = class PaginationService {
    async paginate(model, criteria, select, page = 1, limit = 10, populate = [], sort = [{ createdAt: -1 }]) {
        const pagination = {
            page: Math.ceil(page),
            limit: Math.ceil(limit),
        };
        let result = [];
        let prevPage;
        let nextPage;
        const params = criteria || { isDeleted: { $ne: true } };
        const count = await model.countDocuments(params);
        const totalPage = Math.ceil(count / pagination.limit);
        if (pagination.page >= 1 &&
            pagination.limit >= 1 &&
            totalPage >= pagination.page) {
            const skip = limit * (pagination.page - 1);
            const query = model.find(params);
            if (!(0, lodash_1.isEmpty)(select)) {
                query.select(select);
            }
            sort.forEach((s) => {
                query.sort(s);
            });
            query.skip(skip).limit(pagination.limit);
            if (!(0, lodash_1.isEmpty)(populate)) {
                populate.forEach((p) => {
                    query.populate(p);
                });
            }
            result = (await query.exec());
            prevPage = pagination.page - 1 > 0 ? pagination.page - 1 : undefined;
            nextPage =
                pagination.page + 1 > totalPage ? undefined : pagination.page + 1;
        }
        return {
            data: result,
            metadata: {
                page: pagination.page,
                perPage: pagination.limit,
                total: count,
                pageCount: result.length,
                previousPage: prevPage,
                nextPage,
            },
        };
    }
    async aggregatePaginate(model, criteria, page = 1, limit = 10) {
        const pagination = {
            page: Math.ceil(page),
            limit: Math.ceil(limit),
        };
        let result = [];
        let prevPage;
        let nextPage;
        const params = (0, lodash_1.cloneDeep)(criteria);
        let count = 0;
        const resTotal = await model.aggregate(params).count('total');
        if (resTotal.length > 0) {
            count = resTotal[0].total;
        }
        const totalPage = Math.ceil(count / pagination.limit);
        if (pagination.page >= 1 &&
            pagination.limit >= 1 &&
            totalPage >= pagination.page) {
            const skip = limit * (pagination.page - 1);
            const query = model
                .aggregate(criteria)
                .skip(skip)
                .limit(pagination.limit);
            result = (await query);
            prevPage = pagination.page - 1 > 0 ? pagination.page - 1 : undefined;
            nextPage =
                pagination.page + 1 > totalPage ? undefined : pagination.page + 1;
        }
        return {
            data: result,
            metadata: {
                page: pagination.page,
                perPage: pagination.limit,
                total: count,
                pageCount: result.length,
                previousPage: prevPage,
                nextPage,
            },
        };
    }
    manualPaginate(data, totalDocs, limit = 10, page = 1) {
        const totalPages = Math.ceil(totalDocs / limit);
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        const hasPrevPage = previousPage !== null;
        const hasNextPage = nextPage !== null;
        const pagingCounter = (page - 1) * limit;
        const paginationMetadata = {
            limit,
            totalPages,
            page,
            previousPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            totalDocs,
            pagingCounter,
        };
        return {
            data,
            metadata: paginationMetadata,
        };
    }
};
exports.PaginationService = PaginationService;
exports.PaginationService = PaginationService = __decorate([
    (0, common_1.Injectable)()
], PaginationService);
//# sourceMappingURL=pagination.service.js.map