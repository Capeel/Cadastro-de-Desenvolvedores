'use client'

import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, FormLabel, HStack, Input, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionFormLabel = motion(FormLabel)

export default function NivelHome() {
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");


  return (
    <VStack
      width="100%"
      padding={10}
    >
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
          <FormControl position="relative" variant="flushed" marginTop="20px">
            <MotionFormLabel
              position="absolute"
              top={isFocus || inputValue ? "-4" : "3"}
              left="3"
              fontSize={isFocus || inputValue ? "md" : "lg"}
              color={isFocus ? "blue.500" : "gray.500"}
              initial={false}
              animate={{
                top: isFocus || inputValue ? -20 : 12,
                fontSize: isFocus || inputValue ? "1rem" : "1rem",
                color: isFocus ? "#2D3748" : "#2D3748"
              }}
              transition={{ duration: 0.2 }}
            >
              Digite sua busca
            </MotionFormLabel>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              paddingLeft="2"
              variant="flushed"
            />
          </FormControl>
        </VStack>
        <Stack marginTop="70px">
          <TableContainer>
            <Table>
              <Thead bgColor="gray.600">
                <Tr>
                  <Th color="white">Nível</Th>
                  <Th color="white">Ações</Th>
                </Tr>
              </Thead>
              <Tbody bgColor="gray.500">
                <Tr>
                  <Td width="70%" color="white">Nível</Td>
                  <Td>
                    <HStack>
                      <Button>Editar</Button>
                      <Button>Excluir</Button>
                    </HStack>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </VStack >
  )
}
