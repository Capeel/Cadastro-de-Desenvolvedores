import { DesenvolvedoresDataDto, DesenvolvedoresIndexPaginatedDto, DesenvolvedorFormDto } from "@/app/dashboard/desenvolvedores/types"
import api from "@/config/axiosConfig"

export const useDesenvolvedores = () => {
  const getDevelopers = ({
    nivel,
    nome,
    data_nascimento,
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
    if (data_nascimento) {
      params = `${params}&data_nascimento=${data_nascimento}`;
    }
    if (sexo) {
      params = `${params}&sexo=${sexo}`;
    }
    if (hobby) {
      params = `${params}&hobby=${hobby}`;
    }

    return api.get<DesenvolvedoresIndexPaginatedDto>(`/desenvolvedores/index?${params}`)
  }

  const createDevelopers = (data: DesenvolvedorFormDto) => {
    return api.post<DesenvolvedorFormDto>(`/desenvolvedores/create`, data);
  }

  const editDevelopers = (id: number, data: DesenvolvedorFormDto) => {
    return api.patch<DesenvolvedorFormDto>(`/desenvolvedores/update/${id}`, data);
  }

  const deletDeveloper = (id: number) => {
    return api.delete(`/desenvolvedores/${id}`);
  }

  return {
    getDevelopers,
    createDevelopers,
    editDevelopers,
    deletDeveloper
  }
}