export type NiveisDataDto = {
  id: number,
  nivel: string;
};

export type NiveisIndexPaginatedDto = {
  data: NiveisDataDto[];
  per_page: number;
  current_page: number;
  last_page: number;
  total: number;
}