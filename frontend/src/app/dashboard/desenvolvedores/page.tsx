'use client'

import { AddIcon, DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box, Button, Divider, Flex, HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead,
  Tr, useDisclosure, useToast, VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { NiveisFilterDto, NiveisFormData } from '../niveis/types'
import { AnimatedInput } from '@/components/customInput'
import { useForm } from 'react-hook-form';
import { Pagination } from '@/components/pagination'
import { LoadingOverlay } from '@/components/loadingOverlay'
import { useDesenvolvedores } from '@/hooks/useDesenvolvedores'
import { DesenvolvedorDto, DesenvolvedoresDataDto, DesenvolvedoresFilterDto, DesenvolvedorFormDto } from './types'
import { useNiveis } from '@/hooks/useNiveis'

export default function DesenvolvedoresHomoe() {
  const [inputValue, setInputValue] = useState<string>();
  const [current_page, set_current_page] = useState<number>(1);
  const { getDevelopers, createDevelopers, editDevelopers, deletDeveloper } = useDesenvolvedores();
  const { getAllNiveis } = useNiveis();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [desenvolvedores, setDesenvolvedores] = useState<DesenvolvedorDto[]>([]);
  const [niveis, setNiveis] = useState<NiveisFilterDto[]>([])
  const [filter, setFilter] = useState<DesenvolvedoresFilterDto>();
  const [filterField, setFilterField] = useState<string>("");
  const [per_page, set_per_page] = useState(5);
  const [total, set_total] = useState<number>();
  const [last_page, set_last_page] = useState<number>()
  const customToast = useToast();
  const { register, handleSubmit, watch, reset } = useForm<DesenvolvedorFormDto>();
  const watchedNome = watch('nome');
  const watchedSexo = watch('sexo');
  const watchedNasc = watch('data_nascimento');
  const watchedHobby = watch('hobby');

  const filtersType = [
    { value: "nome", name: "Nome" },
    { value: "nivel", name: "Nível" },
    { value: "sexo", name: "Sexo" },
    { value: "data_nascimento", name: "Data de Nascimento" },
    { value: "hobby", name: "Hobby" },
  ]


  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelte
  } = useDisclosure();
  const [devToDelete, setDevToDelete] = useState<DesenvolvedorDto>();
  const [editingDesenvolvedor, setEditingDesenvolvedor] = useState<DesenvolvedorDto | null>()

  const callbackDesenvolvedores = useCallback(() => {
    setIsLoading(true);
    getDevelopers({ current_page, per_page, ...filter })
      .then((response) => {
        setDesenvolvedores(response.data.data)
        set_current_page(current_page)
        set_total(response.data.total)
        set_last_page(response.data.last_page);
        return getAllNiveis()
          .then((response) => {
            setNiveis(response.data);
          })
      })
      .catch((error) => {
        customToast({ status: "error", description: error.response?.data?.message });
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [current_page, filter]);

  useEffect(() => {
    callbackDesenvolvedores()
  }, [callbackDesenvolvedores]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        [filterField]: inputValue
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, filterField]);

  const handlePageChange = (page: number) => {
    set_current_page(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    set_per_page(itemsPerPage);
    set_current_page(1);
  };

  const onSubmit = (data: DesenvolvedorFormDto) => {
    setIsLoading(true);

    const { id, ...resp } = data;

    const developerData = {
      nome: resp.nome,
      sexo: resp.sexo,
      data_nascimento: resp.data_nascimento,
      hobby: resp.hobby,
      nivel: { id: data.nivel.id }
    }

    const developerSaveData = {
      nome: data.nome,
      sexo: data.sexo,
      data_nascimento: data.data_nascimento,
      hobby: data.hobby,
      nivel: { id: data.nivel.id }
    }

    const request = editingDesenvolvedor
      ? editDevelopers(editingDesenvolvedor.id!, developerData)
      : createDevelopers(developerSaveData);

    const successMessage = editingDesenvolvedor
      ? "Desenvolvedor editado com sucesso!"
      : "Desenvolvedor criado com sucesso!";

    request
      .then(() => {
        customToast({
          status: 'success',
          description: successMessage,
          position: "top-right"
        });
      })
      .catch((error) => {
        customToast({
          status: "error",
          description: error.response?.data?.message,
          position: "top-right"
        });
      })
      .finally(() => {
        callbackDesenvolvedores();
        onClose();
        setIsLoading(false);
      });
  }

  const handleDeleteModal = (nivel: DesenvolvedorDto) => {
    setDevToDelete(nivel);
    onOpenDelete();
  }

  const handleConfirmDelte = (id: number) => {
    if (!devToDelete) return;
    setIsLoading(true);
    deletDeveloper(id)
      .then(() => {
        customToast({
          status: 'success',
          description: "Desenvolvedor excluido com sucesso",
          position: "top-right"
        });
      })
      .catch((error) => {
        customToast({
          status: "error",
          description: error.response?.data?.message,
          position: "top-right"
        });
      })
      .finally(() => {
        callbackDesenvolvedores();
        onCloseDelte();
        setIsLoading(false);
      });
  }

  const newNivelModal = () => {
    setEditingDesenvolvedor(null);
    reset({ nome: "" });
    onOpen();
  }

  const editDevModal = (data: DesenvolvedorDto) => {
    const formatarDataParaInput = (data: string) => {
      if (!data) return '';
      const date = new Date(data);
      return date.toISOString().split('T')[0];
    };
    reset({
      ...data,
      data_nascimento: formatarDataParaInput(data.data_nascimento),
      nivel: { id: data.nivel.id }
    });
    setEditingDesenvolvedor(data);
    onOpen();
  }


  return (
    <VStack
      width="100%"
      padding={10}
    >
      {isLoading && (<LoadingOverlay isOpen={isLoading} />)}
      <Box
        width="100%"
        minH="90vh"
        bgColor="gray.400"
        borderRadius={10}
        padding={10}
      >
        <HStack justifyContent="space-between">
          <Text
            fontSize="4xl"
            fontFamily="Geist"
            color="gray.700"
            fontWeight="semibold"
          >
            Cadastro de Nível
          </Text>
          <Button
            width="250px"
            bgColor="gray.600"
            color="gray.100"
            colorScheme="blackAlpha"
            onClick={() => newNivelModal()}
          >
            Novo Desenvolvedor
            <AddIcon width="13px" marginLeft={2} />
          </Button>
        </HStack>
        <VStack
          marginTop={3}
          align="start"
          spacing={3}
        >
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bgColor="gray.300">
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader
                  marginTop="10px"
                  fontSize="27px"
                  fontFamily="Geist"
                  color="gray.700"
                  fontWeight="semibold"
                >
                  Adicionar Desenvolvedor
                </ModalHeader>
                <ModalBody marginBottom="50px">
                  <VStack>
                    <AnimatedInput
                      marginTop="15px"
                      marginLeft={3}
                      width="95%"
                      label="Nome do Desenvolvedor"
                      value={watchedNome}
                      {...register('nome')}
                    />
                    <VStack w="100%" alignItems="start">
                      <Text
                        textAlign="start"
                        fontSize="1rem"
                        marginLeft={3}
                        marginTop="15px"
                        color="#2D3748"
                        fontWeight="semibold"
                      >Selecione o Nível
                      </Text>
                      <Select
                        width="98%"
                        placeholder="Selecione o nível que deseja:"
                        variant="flushed"
                        paddingLeft={2}
                        {...register("nivel.id")}
                      >
                        {niveis.map((nv) => {
                          return (
                            <option
                              value={nv.id}
                              key={nv.id}
                              style={{
                                backgroundColor: "#718096",
                                paddingLeft: "20px",
                                color: "white"
                              }}
                            >
                              {nv.nivel}
                            </option>
                          )
                        })}
                      </Select>
                    </VStack>
                    <AnimatedInput
                      marginTop="25px"
                      label="Sexo"
                      marginLeft={1}
                      width="98%"
                      value={watchedSexo}
                      {...register('sexo')}
                    />
                    <VStack
                      w="100%"
                      marginTop="25px"
                      alignItems="start"
                    >
                      <Text
                        color="#2D3748"
                        fontWeight="semibold"
                        fontSize="1rm"
                        marginLeft={3}
                      >
                        Data de Nascimento
                      </Text>
                      <Input
                        variant="flushed"
                        width="100%"
                        type="date"
                        paddingLeft={3}
                        {...register('data_nascimento')}
                      />
                    </VStack>
                    <AnimatedInput
                      marginTop="25px"
                      width="100%"
                      label="Hobby"
                      value={watchedHobby}
                      {...register('hobby')}
                    />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    width="250px"
                    bgColor="gray.600"
                    color="gray.100"
                    colorScheme="blackAlpha"
                    type="submit"
                  >
                    {editingDesenvolvedor ? "Editar Desenvolvedor" : "Salvar Desenvolvedor"}
                    <PlusSquareIcon marginLeft={2} marginTop="2px" />
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <VStack w="100%" alignItems="start">
            <Text
              marginBottom="-15px"
              textAlign="start"
              fontSize="1.3rem"
              color="#2D3748"
              fontWeight="semibold"
            >
              Escolha o que quer buscar:
            </Text>
            <HStack justifyContent="space-between" w="100%">
              <Select
                w="20%"
                marginBottom="-20px"
                variant="flushed"
                onChange={(e) => setFilterField(e.target.value)}
                placeholder="Selecione sua busca:"
              >
                {filtersType.map((filt) => {
                  return (
                    <option
                      value={filt.value}
                      key={filt.value}
                      style={{
                        backgroundColor: "#718096",
                        paddingLeft: "20px",
                        color: "white"
                      }}
                    >
                      {filt.name}
                    </option>
                  )
                })}
              </Select>
              <AnimatedInput
                label="Digite sua busca:"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </HStack>
          </VStack>
        </VStack>
        <Stack marginTop="70px">
          <TableContainer>
            <Table>
              <Thead bgColor="gray.600">
                <Tr>
                  <Th color="white" width="30%">Nome</Th>
                  <Th color="white" width="20%">Nível</Th>
                  <Th color="white" width="10%">Sexo</Th>
                  <Th color="white" width="10%">Data de Nascimento</Th>
                  <Th color="white" width="10%">Hobby</Th>
                  <Th color="white" textAlign={"center"}>Ações</Th>
                </Tr>
              </Thead>
              <Tbody bgColor="gray.500">
                {desenvolvedores.map((devs) => {
                  return (
                    <Tr key={devs.id}>
                      <Td width="30%" color="white">{devs.nome}</Td>
                      <Td width="20%" color="white">{devs.nivel.nivel}</Td>
                      <Td width="10%" color="white">{devs.sexo}</Td>
                      <Td width="10%" color="white">
                        {new Date(devs.data_nascimento).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </Td>
                      <Td width="10%" color="white">{devs.hobby}</Td>
                      <Td>
                        <HStack justifyContent={"space-between"}>
                          <Button w="100%" onClick={(() => editDevModal(devs))}>
                            Editar
                            <EditIcon marginLeft={2} />
                          </Button>
                          <Button w="100%" onClick={() => handleDeleteModal(devs)}>
                            Excluir
                            <DeleteIcon marginLeft={2} />
                          </Button>
                        </HStack>
                        <Modal
                          isOpen={isOpenDelete}
                          onClose={onCloseDelte}
                          isCentered
                        >
                          <ModalOverlay />
                          <ModalContent bgColor="gray.300">
                            <ModalHeader
                              marginTop="10px"
                              fontSize="27px"
                              fontFamily="Geist"
                              color="gray.700"
                              fontWeight="semibold"
                              textAlign="center"
                            >
                              {`Tem certeza que deseja exlcuir o Desenvolvedor ${devToDelete?.nome}?`}
                            </ModalHeader>
                            <Divider />
                            <ModalBody>
                              <HStack justifyContent="space-between" margin={7}>
                                <Button
                                  width="100%"
                                  onClick={() => onCloseDelte()}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  width="100%"
                                  onClick={() => {
                                    if (devToDelete?.id !== undefined) {
                                      handleConfirmDelte(devToDelete.id)
                                    }
                                  }}
                                  bgColor="red.500"
                                  colorScheme="red"
                                >
                                  Confirmar
                                </Button>
                              </HStack>
                            </ModalBody>
                          </ModalContent>
                        </Modal>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
          {total && last_page && (
            <Pagination
              currentPage={current_page}
              itemsPerPage={per_page}
              totalItems={total}
              totalPages={last_page}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </Stack>
      </Box>
    </VStack >
  )
}
