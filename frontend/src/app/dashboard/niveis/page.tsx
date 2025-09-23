'use client'

import { useNiveis } from '@/hooks/useNiveis'
import { AddIcon, ArrowDownIcon, ArrowUpIcon, DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box, Button, Flex, FormControl, FormErrorMessage, HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead,
  Tr, useDisclosure, useToast, VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { NiveisDataDto, NiveisFilterDto, NiveisFormData } from './types'
import { AnimatedInput } from '@/components/customInput'
import { useForm } from 'react-hook-form';
import { Pagination } from '@/components/pagination'
import { LoadingOverlay } from '@/components/loadingOverlay'
import { useDesenvolvedores } from '@/hooks/useDesenvolvedores'

export default function NivelHome() {
  const [inputValue, setInputValue] = useState("");
  const [current_page, set_current_page] = useState<number>(1);
  const { getLevels, saveLevel, deleteLevel, editLevel } = useNiveis();
  const { getDevsCount } = useDesenvolvedores();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [nivel, setNivel] = useState<NiveisDataDto[]>([]);
  const [filter, setFilter] = useState<NiveisFilterDto>();
  const [per_page, set_per_page] = useState(5);
  const [total, set_total] = useState<number>();
  const [last_page, set_last_page] = useState<number>()
  const customToast = useToast();
  const [devsCount, setDevsCount] = useState();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<NiveisFormData>();
  const watchedNivel = watch('nivel');
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelte
  } = useDisclosure();
  const [nivelToDelete, setNivelToDelete] = useState<NiveisFormData>();
  const [editingNivel, setEditingNivel] = useState<NiveisFormData | null>()
  const [orderBy, setOrderBy] = useState<"asc" | "dsc">("asc");

  const callbackNivel = useCallback(() => {
    setIsLoading(true);
    getLevels({ current_page, per_page, ...filter })
      .then((response) => {
        console.log(response.data)
        setNivel(response.data.data)
        set_current_page(current_page)
        set_total(response.data.total)
        set_last_page(response.data.last_page);
        return getDevsCount()
          .then((response) => {
            setDevsCount(response.data);
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
    callbackNivel()
  }, [callbackNivel]);

  const sortByName = () => {
    const sorted = [...nivel].sort((a, b) => {
      const nameA = a.nivel ?? "";
      const nameB = b.nivel ?? "";

      return orderBy === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setNivel(sorted);
    setOrderBy(orderBy === "asc" ? "dsc" : "asc")
  }


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter({ ...filter, nivel: inputValue });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handlePageChange = (page: number) => {
    set_current_page(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    set_per_page(itemsPerPage);
    set_current_page(1);
  };

  const onSubmit = (data: NiveisFormData) => {
    setIsLoading(true);

    const { id, ...resp } = data;


    const request = editingNivel
      ? editLevel(editingNivel.id!, resp)
      : saveLevel(data);

    const successMessage = editingNivel
      ? "Nível editado com sucesso!"
      : "Nível criado com sucesso!";

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
        callbackNivel();
        onClose();
        setIsLoading(false);
      });
  }

  const handleDeleteModal = (nivel: NiveisFormData) => {
    setNivelToDelete(nivel);
    onOpenDelete();
  }

  const handleConfirmDelte = (id: number) => {
    if (!nivelToDelete) return;
    setIsLoading(true);
    deleteLevel(id)
      .then(() => {
        customToast({
          status: 'success',
          description: "Nível excluido com sucesso",
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
        callbackNivel();
        onCloseDelte();
        setIsLoading(false);
      });
  }

  const newNivelModal = () => {
    setEditingNivel(null);
    reset({ nivel: "" });
    onOpen();
  }

  const editNivelModal = (data: NiveisFormData) => {
    reset(data);
    setEditingNivel(data);
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
            Cadastro de Nível
          </Text>
        </Box>
        <Box minWidth="100%" bgColor="blue.100" padding={10} marginTop="-8px" 
        borderBottomWidth={3} borderBottomColor="blue.700">
          <HStack
            justifyContent="space-between"
            width="100%"
          >
            <AnimatedInput
              label="Digite sua busca:"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              width="80%"
              borderBottomWidth={2}
              borderBottomColor="blue.700"
            />
            <Button
              width="300px"
              bgColor="blue.700"
              color="white"
              colorScheme="blue"
              marginBottom="-23px"
              onClick={() => newNivelModal()}
            >
              Novo Nível
              <AddIcon width="13px" marginLeft={2} />
            </Button>
          </HStack>
        </Box>
      </VStack>
      <Stack width="100%">
        <Box
          width="100%"
          paddingLeft={8}
          paddingRight={8}
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
                    Adicionar Nível
                  </ModalHeader>
                  <ModalBody marginBottom="50px">
                    <Flex>
                      <FormControl isInvalid={!!errors.nivel}>
                        <AnimatedInput
                          marginTop="15px"
                          width="100%"
                          label="Nome do nível:"
                          value={watchedNivel}
                          {...register('nivel', { required: 'Nivel é obrigatório' })}
                        />
                        <FormErrorMessage>
                          {errors.nivel && errors.nivel.message}
                        </FormErrorMessage>
                      </FormControl>
                    </Flex>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      width="250px"
                      bgColor="blue.700"
                      color="white"
                      colorScheme="blue"
                      type="submit"
                    >
                      {editingNivel ? "Editar Nível" : "Salvar Nivel"}
                      <PlusSquareIcon marginLeft={2} marginTop="2px" />
                    </Button>
                  </ModalFooter>
                </form>
              </ModalContent>
            </Modal>
          </VStack>
          <Stack marginTop="30px">
            <TableContainer>
              <Table>
                <Thead bgColor="blue.700">
                  <Tr>
                    <Th color="white" onClick={sortByName} fontSize="15px">
                      Nível {
                        orderBy === "asc" ? <ArrowDownIcon />
                          : <ArrowUpIcon />}
                    </Th>
                    <Th color="white" fontSize="15px">
                      Quantidade de Desenvolvedores
                    </Th>
                    <Th color="white" textAlign={"center"} fontSize="15px">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody bgColor="blue.50">
                  {nivel.map((niveis) => {

                    const countDev = (devsCount ?? []).find
                      (dc => dc["nivel.id"] === niveis.id) as {
                        "nivel.id": number; devCount: number
                      } | undefined;
                    const count = countDev?.devCount ?? 0;

                    return (
                      <Tr key={niveis.id}>
                        <Td width="70%" color="black">{niveis.nivel}</Td>
                        <Td textAlign="center" color="black">{count}</Td>
                        <Td>
                          <HStack justifyContent={"space-between"}>
                            <Button w="100%" bgColor="blue.700" colorScheme="blue" color="white" onClick={(() => editNivelModal(niveis))}>
                              Editar
                              <EditIcon marginLeft={2} />
                            </Button>
                            <Button w="100%" bgColor="blue.700" colorScheme="blue" color="white" onClick={() => handleDeleteModal(niveis)}>
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
                                {`Tem certeza que deseja exlcuir o Nivel ${nivelToDelete?.nivel}?`}
                              </ModalHeader>
                              <ModalBody>
                                <HStack justifyContent="space-between" margin={7}>
                                  <Button
                                    width="100%"
                                    onClick={() => onCloseDelte()}
                                    bgColor="blue.700"
                                    color="white"
                                    colorScheme="blue"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    width="100%"
                                    onClick={() => {
                                      if (nivelToDelete?.id !== undefined) {
                                        handleConfirmDelte(nivelToDelete.id)
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
          </Stack>
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
        </Box >
      </Stack>
    </VStack >
  )
}
