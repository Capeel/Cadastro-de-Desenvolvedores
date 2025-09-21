'use client'

import { useNiveis } from '@/hooks/useNiveis'
import { AddIcon, DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box, Button, Divider, Flex, HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead,
  Tr, useDisclosure, useToast, VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { NiveisDataDto, NiveisFilterDto, NiveisFormData } from './types'
import { AnimatedInput } from '@/components/customInput'
import { useForm } from 'react-hook-form';
import { Pagination } from '@/components/pagination'

export default function NivelHome() {
  const [inputValue, setInputValue] = useState("");
  const [current_page, set_current_page] = useState<number>(1);
  const { getLevels, saveLevel, deleteLevel, editLevel } = useNiveis();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [nivel, setNivel] = useState<NiveisDataDto[]>([]);
  const [filter, setFilter] = useState<NiveisFilterDto>();
  const [per_page, set_per_page] = useState(5);
  const [total, set_total] = useState<number>();
  const [last_page, set_last_page] = useState<number>()
  const customToast = useToast();
  const { register, handleSubmit, watch, reset } = useForm<NiveisFormData>();
  const watchedNivel = watch('nivel');
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelte
  } = useDisclosure();
  const [nivelToDelete, setNivelToDelete] = useState<NiveisFormData>();
  const [editingNivel, setEditingNivel] = useState<NiveisFormData | null>()

  const callbackNivel = useCallback(() => {
    setIsLoading(true);
    getLevels({ current_page, per_page, ...filter })
      .then((response) => {
        console.log(response.data)
        setNivel(response.data.data)
        set_current_page(current_page)
        set_total(response.data.total)
        set_last_page(response.data.last_page);
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
      padding={10}
    >
      {isLoading && (<Spinner />)}
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
            Novo Nível
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
                  Adicionar Nível
                </ModalHeader>
                <ModalBody marginBottom="50px">
                  <Flex>
                    <AnimatedInput
                      marginTop="15px"
                      width="100%"
                      label="Nome do nível:"
                      value={watchedNivel}
                      {...register('nivel')}
                    />
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <Button
                    width="250px"
                    bgColor="gray.600"
                    color="gray.100"
                    colorScheme="blackAlpha"
                    type="submit"
                  >
                    {editingNivel ? "Editar Nível" : "Salvar Nivel"}
                    <PlusSquareIcon marginLeft={2} marginTop="2px" />
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <AnimatedInput
            label="Digite sua busca:"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </VStack>
        <Stack marginTop="70px">
          <TableContainer>
            <Table>
              <Thead bgColor="gray.600">
                <Tr>
                  <Th color="white">Nível</Th>
                  <Th color="white" textAlign={"center"}>Ações</Th>
                </Tr>
              </Thead>
              <Tbody bgColor="gray.500">
                {nivel.map((niveis) => {
                  return (
                    <Tr key={niveis.id}>
                      <Td width="80%" color="white">{niveis.nivel}</Td>
                      <Td>
                        <HStack justifyContent={"space-between"}>
                          <Button w="100%" onClick={(() => editNivelModal(niveis))}>
                            Editar
                            <EditIcon marginLeft={2} />
                          </Button>
                          <Button w="100%" onClick={() => handleDeleteModal(niveis)}>
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
                              {`Tem certeza que deseja exlcuir o Nivel ${nivelToDelete?.nivel}?`}
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
