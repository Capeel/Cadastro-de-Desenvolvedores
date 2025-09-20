export type DesenvolvedoresDataDto = {
  id: number;
  nivel: { id: number };
  nome: string;
  sexo: string;
  data_nascimento: Date;
  hobby: string;
}

export type DesenvolvedoresIndexPaginatedDto = {
  data: DesenvolvedoresDataDto[];
  per_page: number;
  current_page: number;
  last_page: number;
  total: number;
}