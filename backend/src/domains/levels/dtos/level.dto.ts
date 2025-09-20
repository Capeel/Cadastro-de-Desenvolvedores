export type LevelDataDto = {
  id: number,
  level: string;
};

export type LevelIndexPaginatedDto = {
  data: LevelDataDto[];
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
}