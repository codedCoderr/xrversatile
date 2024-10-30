import { Model, Document, FilterQuery } from 'mongoose';
export declare class PaginationMetaData {
    page: number;
    perPage: number;
    total: number;
    previousPage: number;
    nextPage: number;
    pageCount: number;
}
export interface PaginationResult<T extends Document | any> {
    data: T[];
    metadata: PaginationMetaData;
}
export interface AggregatePaginationResult<T> {
    data: T[];
    metadata: PaginationMetaData;
}
export interface PaginationFilter {
    perPage?: number;
    page?: number;
    status?: any;
}
export declare class PaginationService {
    paginate<T extends Document>(model: Model<T>, criteria: FilterQuery<T>, select?: string, page?: number, limit?: number, populate?: any[], sort?: string[] | Record<string, number | string>[]): Promise<PaginationResult<T>>;
    aggregatePaginate<T>(model: Model<Document>, criteria: any[], page?: number, limit?: number): Promise<AggregatePaginationResult<T>>;
    manualPaginate(data: any[], totalDocs: number, limit?: number, page?: number): {
        data: any[];
        metadata: {
            limit: number;
            totalPages: number;
            page: number;
            previousPage: number;
            nextPage: number;
            hasPrevPage: boolean;
            hasNextPage: boolean;
            totalDocs: number;
            pagingCounter: number;
        };
    };
}
