'use client'

import { List, ListItem, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionVStack = motion(VStack)

export default function DashboardHome() {

  return (
    <MotionVStack
      minH="100vh"
      align="start"
      justify="start"
      spacing="6"
      paddingLeft="5%"
      color="white"
      initial={{ z: -500, opacity: 0, backgroundColor: "#2D3748" }}
      animate={{ z: 0, opacity: 1, backgroundColor: "#4A5568" }}
      exit={{ z: 50, opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <MotionVStack
        initial={{ y: -500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Text
          fontSize="4xl"
          fontWeight="bold"
          paddingTop="10%"
          fontFamily="Geist"
        >
          Projeto de Cadastro de Desenvolvedores 🚀
        </Text>
        <List >
          <ListItem>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              paddingTop="4%"
              fontFamily="Geist"
            >
              Cadastre Níveis de Desenvolvedores 📄
            </Text>
          </ListItem>
          <ListItem>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              paddingTop="4%"
              fontFamily="Geist"
            >
              Cadastre Desenvoldedores e Vincule o Nível a eles! 📝
            </Text>
          </ListItem>
        </List>

      </MotionVStack>
    </MotionVStack>
  )
}
