'use client'

import { VStack, Button } from '@chakra-ui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionVStack = motion(VStack);

export default function Sidebar() {
  return (
    <MotionVStack
      as="nav"
      w="250px"
      backgroundColor={"gray.700"}
      color="white"
      p="4"
      spacing="4"
      align="stretch"
      paddingTop="40"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.9, delay: 1}}
    >
      <Link href="/dashboard" passHref>
        <Button w="100%">Início</Button>
      </Link>
      <Link href="/dashboard/niveis" passHref>
        <Button w="100%">Níveis</Button>
      </Link>
      <Link href="/dashboard/desenvolvedores" passHref>
        <Button w="100%">Desenvolvedores</Button>
      </Link>
    </MotionVStack>
  )
}
