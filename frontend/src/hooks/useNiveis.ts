import { NiveisDataDto, NiveisFormData, NiveisIndexPaginatedDto } from "@/app/dashboard/niveis/types";
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

    return api.get<NiveisIndexPaginatedDto>(`/levels/index?${params}`);
  }

  const saveLevel = (data: NiveisFormData) => {
    return api.post(`/levels/create`, data);
  }

  const editLevel = (id: number, data: NiveisFormData) => {
    return api.patch(`/levels/update/${id}`, data);
  }

  const deleteLevel = (id: number) => {
    return api.delete(`/levels/${id}`);
  }

  const getAllLevels = () => {
    return api.get(`/levels/get-all`);
  }


  return {
    getLevels,
    saveLevel,
    deleteLevel,
    editLevel,
    getAllLevels,
  }
}