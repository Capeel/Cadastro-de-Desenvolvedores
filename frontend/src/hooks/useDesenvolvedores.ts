import { DesenvolvedoresDataDto, DesenvolvedoresIndexPaginatedDto, DesenvolvedorFormDto } from "@/app/dashboard/desenvolvedores/types"
import api from "@/config/axiosConfig"

export const useDesenvolvedores = () => {
  const getDevelopers = ({
    nivel,
    nome,
    sexo,
    hobby,
    current_page,
    per_page
  }: DesenvolvedoresDataDto) => {
    let params = `current_page=${current_page}&per_page=${per_page}`

    if (nivel) {
      params = `${params}&nivel=${nivel}`;
    }
    if (nome) {
      params = `${params}&nome=${nome}`;
    }
    if (sexo) {
      params = `${params}&sexo=${sexo}`;
    }
    if (hobby) {
      params = `${params}&hobby=${hobby}`;
    }

    return api.get<DesenvolvedoresIndexPaginatedDto>(`/developers/index?${params}`)
  }

  const createDevelopers = (data: DesenvolvedorFormDto) => {
    return api.post<DesenvolvedorFormDto>(`/developers/create`, data);
  }

  const editDevelopers = (id: number, data: DesenvolvedorFormDto) => {
    return api.patch<DesenvolvedorFormDto>(`/developers/update/${id}`, data);
  }

  const deletDeveloper = (id: number) => {
    return api.delete(`/developers/${id}`);
  }

  const getDevsCount = () => {
    return api.get(`/developers/levels-per-dev`);
  }

  return {
    getDevelopers,
    createDevelopers,
    editDevelopers,
    deletDeveloper,
    getDevsCount
  }
}