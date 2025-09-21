import { NiveisDataDto, NiveisIndexPaginatedDto } from "@/app/dashboard/niveis/types";
import api from "@/config/axiosConfig";

export const useNiveis = () => {
  const getLevels = ({
    nivel,
    current_page,
    per_page,
  }: NiveisDataDto) => {
    let params = `current_page=${current_page}&per_page=${per_page}`

    if (nivel) {
      params = `${params}&nivel=${nivel}`;
    }

    return api.get<NiveisIndexPaginatedDto>(`/niveis/index?${params}`);
  }

  return {
    getLevels,
  }
}