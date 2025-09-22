'use client'

import { AddIcon, ArrowDownIcon, ArrowUpIcon, DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box, Button, Divider, FormControl, FormErrorMessage, HStack,
  Input,
  Menu,
  MenuButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SelectField,
  Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead,
  Tr, useDisclosure, useToast, VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { NiveisFilterDto } from '../niveis/types'
import { AnimatedInput } from '@/components/customInput'
import { useForm } from 'react-hook-form';
import { Pagination } from '@/components/pagination'
import { LoadingOverlay } from '@/components/loadingOverlay'
import { useDesenvolvedores } from '@/hooks/useDesenvolvedores'
import { DesenvolvedorDto, DesenvolvedoresFilterDto, DesenvolvedorFormDto } from './types'
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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<DesenvolvedorFormDto>();
  const watchedNome = watch('nome');
  const watchedSexo = watch('sexo');
  const watchedHobby = watch('hobby');
  const [orderBy, setOderBy] = useState<"asc" | "dsc">("asc");

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

  const sortBy = () => {
    const sorted = [...desenvolvedores].sort((a, b) => {
      const nameA = a.nome ?? "";
      const nameB = b.nome ?? "";

      return orderBy == "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    })
    setDesenvolvedores(sorted);
    setOderBy(orderBy === "asc" ? "dsc" : "asc");
  }

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
    >
      {isLoading && (<LoadingOverlay isOpen={isLoading} />)}
      <VStack minWidth="100%">
        <Box
          minHeight="100px"
          minWidth="100%"
          bgColor="#2a4365"
          alignContent="center"
          paddingLeft={5}
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            fontFamily="Geist"
            color="white"
          >
            Cadastro de Desenvolvedores
          </Text>
        </Box>
        <VStack w="100%" alignItems="start" bgColor="#EDF2F7" marginTop="-8px">
          <HStack justifyContent="space-between" w="100%" padding={10}>
            <Select
              w="20%"
              marginBottom="-20px"
              variant="flushed"
              onChange={(e) => setFilterField(e.target.value)}
              placeholder="Selecione sua busca:"
              borderBottomWidth={2}
              borderBottomColor="blue.700"
            >
              {filtersType.map((filt) => {
                return (
                  <option
                    value={filt.value}
                    key={filt.value}
                    style={{
                      backgroundColor: "#2c5282",
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
              w="90%"
              borderBottomWidth={2}
              borderBottomColor="blue.700"
            />
            <Button
              width="350px"
              bgColor="blue.700"
              color="white"
              colorScheme="blue"
              onClick={() => newNivelModal()}
              marginBottom="-23px"
            >
              Novo Desenvolvedor
              <AddIcon width="13px" marginLeft={2} />
            </Button>
          </HStack>
        </VStack>
      </VStack>
      <Box
        width="100%"
        paddingRight={8}
        paddingLeft={8}
      >
        <VStack
          align="start"
          spacing={3}
        >
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bgColor="white" borderRadius={3}>
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
                    <FormControl isInvalid={!!errors.nome}>
                      <AnimatedInput
                        marginTop="15px"
                        marginLeft={3}
                        width="95%"
                        label="Nome do Desenvolvedor"
                        value={watchedNome}
                        {...register('nome', { required: "Nome do desenvolvedor deve ser informado" })}
                      />
                      <FormErrorMessage>
                        {errors.nome && errors.nome.message}
                      </FormErrorMessage>
                    </FormControl>
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
                      <FormControl isInvalid={!!errors.nivel?.id}>
                        <Select
                          width="98%"
                          placeholder="Selecione o nível que deseja:"
                          variant="flushed"
                          paddingLeft={2}
                          {...register("nivel.id", { required: "Nível deve ser informado" })}
                        >
                          {niveis.map((nv) => {
                            return (
                              <option
                                value={nv.id}
                                key={nv.id}
                                style={{
                                  backgroundColor: "#2c5282",
                                  color: "white",
                                }}
                              >
                                {nv.nivel}

                              </option>
                            )
                          })}
                        </Select>
                        <FormErrorMessage>
                          {errors.nivel?.id && errors.nivel?.id.message}
                        </FormErrorMessage>
                      </FormControl>
                    </VStack>
                    <FormControl isInvalid={!!errors.sexo}>
                      <AnimatedInput
                        marginTop="25px"
                        label="Sexo"
                        marginLeft={1}
                        width="98%"
                        value={watchedSexo}
                        {...register('sexo', { required: "Sexo deve ser informado" })}
                      />
                      <FormErrorMessage>
                        {errors.sexo && errors.sexo.message}
                      </FormErrorMessage>
                    </FormControl>
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
                      <FormControl isInvalid={!!errors.data_nascimento}>
                        <Input
                          variant="flushed"
                          width="100%"
                          type="date"
                          paddingLeft={3}
                          {...register('data_nascimento',
                            { required: "Data de nascimento deve ser informada" })
                          }
                        />
                        <FormErrorMessage>
                          {errors.data_nascimento && errors.data_nascimento.message}
                        </FormErrorMessage>
                      </FormControl>
                    </VStack>
                    <FormControl isInvalid={!!errors.hobby}>
                      <AnimatedInput
                        marginTop="25px"
                        width="100%"
                        label="Hobby"
                        value={watchedHobby}
                        {...register('hobby', { required: "Hobby deve ser informado" })}
                      />
                      <FormErrorMessage>
                        {errors.hobby && errors.hobby.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    width="250px"
                    bgColor="blue.700"
                    color="white"
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
        </VStack>
        <Stack marginTop="30px">
          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead bgColor="blue.700">
                <Tr>
                  <Th color="white" width="30%" onClick={sortBy} fontSize="15px">
                    Nome {
                      orderBy === "asc" ? <ArrowDownIcon />
                        : <ArrowUpIcon />}
                  </Th>
                  <Th color="white" width="20%" fontSize="15px">Nível</Th>
                  <Th color="white" width="10%" fontSize="15px">Sexo</Th>
                  <Th color="white" width="10%" fontSize="15px">Data de Nascimento</Th>
                  <Th color="white" width="10%" fontSize="15px">Hobby</Th>
                  <Th color="white" textAlign={"center"} fontSize="15px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {desenvolvedores.map((devs) => {
                  return (
                    <Tr key={devs.id}>
                      <Td width="30%" color="black">{devs.nome}</Td>
                      <Td width="20%" color="black">{devs.nivel.nivel}</Td>
                      <Td width="10%" color="black">{devs.sexo}</Td>
                      <Td width="10%" color="black">
                        {new Date(devs.data_nascimento).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </Td>
                      <Td width="10%" color="black">{devs.hobby}</Td>
                      <Td>
                        <HStack justifyContent={"space-between"}>
                          <Button w="100%" bgColor="blue.700" color="white"
                            colorScheme="blue" onClick={(() => editDevModal(devs))}>
                            Editar
                            <EditIcon marginLeft={2} />
                          </Button>
                          <Button w="100%" bgColor="blue.700" color="white"
                            colorScheme="blue" onClick={() => handleDeleteModal(devs)}>
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
                          <ModalContent bgColor="white">
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
                            <ModalBody>
                              <HStack justifyContent="space-between" margin={7}>
                                <Button
                                  width="100%"
                                  onClick={() => onCloseDelte()}
                                  color="white"
                                  bgColor="blue.700"
                                  colorScheme="blue"
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
          <Stack marginTop={10}>
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
        </Stack>
      </Box >
    </VStack >
  )
}
