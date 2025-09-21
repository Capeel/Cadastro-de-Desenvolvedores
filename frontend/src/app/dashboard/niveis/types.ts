export type NiveisDataDto = {
    id?: number;
    nivel?: string;
    current_page: number;
    per_page: number;
};

export type NiveisFormData = {
    id?: number;
    nivel?: string;
}

export type NiveisIndexPaginatedDto = {
    data: NiveisDataDto[];
    per_page: number;
    current_page: number;
    last_page: number;
    total: number;
};

export type NiveisFilterDto = {
    id?: number;
    nivel?: string;
}