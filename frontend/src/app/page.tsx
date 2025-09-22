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
      bgGradient="linear(to-t, #3182ce, #2c5282, #2a4365)"
      color="white"

    >
      <MotionVStack
      >
        <VStack paddingBottom="25%">
          <Text
            fontSize="7xl"
            fontWeight="semibold"
            fontFamily="Geist"
          >
            Bem-vindo ao
          </Text>
          <Text
            fontSize="5xl"
            fontWeight="semibold"
            fontFamily="Geist"
          >
            Gestor de Desenvolvedores
          </Text>
        </VStack>
      </MotionVStack>
      <MotionVStack
        initial={{ z: -500, opacity: 0 }}
        animate={{ z: 0, opacity: 1 }}
        exit={{ z: -500, opacity: 0 }}
        transition={{ duration: 0.9 }}
      >
        <Button
          size="lg"
          colorScheme={"blackAlpha  "}
          color={"white"}
          onClick={handleStart}
          bgGradient="linear(to-r, #2a4365, #1A365D)"
        >
          Clique aqui para continuar
        </Button>
      </MotionVStack>
    </VStack>
  )
}
