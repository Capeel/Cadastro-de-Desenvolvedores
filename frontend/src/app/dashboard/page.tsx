'use client'

import { Box, Image, List, ListItem, Text, VStack } from '@chakra-ui/react'

export default function DashboardHome() {

  return (
    <VStack
      minH="100vh"
      justify="start"
      spacing="6"
      bgColor="whiteAlpha.500"
      color="white"
    >
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
          Tela inicial
        </Text>
      </Box>
      <Image src="/logo.svg" alt="Logo" width="700px" marginTop="30px" />
      <VStack alignItems="center"
        textAlign="center">
        <Text
          fontSize="4xl"
          fontWeight="bold"
          paddingTop="10px"
          fontFamily="Geist"
          color={"black"}
        >
          Gestor de Desenvolvedores
        </Text>
        <List >
          <ListItem>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              paddingTop="4%"
              fontFamily="Geist"
              color={"black"}
            >
              Cadastre Níveis para Desenvolvedores
            </Text>
          </ListItem>
          <ListItem>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              paddingTop="4%"
              fontFamily="Geist"
              color={"black"}
            >
              Cadastre Desenvoldedores e Vincule o Nível a eles!
            </Text>
          </ListItem>
        </List>
      </VStack>
    </VStack>
  )
}
