'use client'

import { useRouter } from 'next/navigation'
import { Button, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionVStack = motion(VStack);

export default function Home() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/dashboard')
  }

  return (
    <VStack
      minH="100vh"
      justify="center"
      align="center"
      spacing="6"
      bgGradient="linear(to-t, #718096, #4A5568, #2D3748)"
      color="white"
    >
      <MotionVStack
        initial={{ y: -500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <VStack paddingBottom="25%">
          <Text
            fontSize="7xl"
            fontWeight="semibold"
            fontFamily="Geist"
          >
            Bem-vindo ao Projeto
          </Text>
          <Text
            fontSize="5xl"
            fontWeight="semibold"
            fontFamily="Geist"
          >
            Cadastro de Desenvolvedores
          </Text>
        </VStack>
      </MotionVStack>
      <MotionVStack
        initial={{ z: -500, opacity: 0 }}
        animate={{ z: 0, opacity: 1 }}
        exit={{ z: -500, opacity: 0 }}
        transition={{ duration: 0.9, delay: 1 }}
      >
        <Button
          size="lg"
          colorScheme={"blackAlpha  "}
          color={"white"}
          onClick={handleStart}
          bgGradient="linear(to-r, #4A5568, #2D3748)"
        >
          Clique aqui para começar
        </Button>
      </MotionVStack>
    </VStack>
  )
}
