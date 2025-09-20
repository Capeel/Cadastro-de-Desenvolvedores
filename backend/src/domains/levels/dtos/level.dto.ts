export type LevelDataDto = {
  id: number,
  level: string;
};

export type LevelIndexPaginatedDto = {
  data: LevelDataDto[];
  page: number;
  perPage: number;
  lastPage: number;
  total: number;
}