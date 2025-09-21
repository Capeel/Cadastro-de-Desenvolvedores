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

    return api.get<NiveisIndexPaginatedDto>(`/niveis/index?${params}`);
  }

  const saveLevel = (data: NiveisFormData) => {
    return api.post(`/niveis/create`, data);
  }

  const editLevel = (id: number, data: NiveisFormData) => {
    return api.patch(`/niveis/update/${id}`, data);
  }

  const deleteLevel = (id: number) => {
    return api.delete(`/niveis/${id}`);
  }

  const getAllNiveis = () => {
    return api.get(`/niveis/get-all`);
  }


  return {
    getLevels,
    saveLevel,
    deleteLevel,
    editLevel,
    getAllNiveis,
  }
}