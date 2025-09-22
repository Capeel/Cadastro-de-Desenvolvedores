'use client'

import { VStack, Button, Image } from '@chakra-ui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, HamburgerIcon } from '@chakra-ui/icons';

const MotionVStack = motion(VStack);

export default function Sidebar() {
  const [sidebarMenu, setSibarMenu] = useState(false);
  return (
    <MotionVStack
      as="nav"
      w="260px"
      backgroundColor={"whiteAlpha.500"}
      color="white"
      p="4"
      spacing="4"
      paddingTop="45px"
      align="stretch"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.9 }}
      borderRightWidth={5}
      borderRightColor="blue.700"
    >
      <Image src="/logo.svg" alt="Logo" width="200px" marginBottom="50px" />
      <VStack alignItems={"start"}>
        <Link href="/dashboard" passHref>
          <Button
            w="100%"
            variant="ghost"
            color="black"
            colorScheme="whiteAlpha"
            fontSize="25px"
            marginBottom="15px"          >
            Início
          </Button>
        </Link>
      </VStack>
      <VStack alignItems={"start"}>
        <Button
          variant="ghost"
          w="100%"
          onClick={() => setSibarMenu(!sidebarMenu)}
          colorScheme="whiteAlpha"
          color="black"
          justifyContent="start"
          marginLeft={-7}
        >
          <HamburgerIcon marginRight={4} color="blue.700" />
          Cadastro
          {sidebarMenu ? <ChevronDownIcon marginLeft={20} color="blue.700" />
            : <ChevronUpIcon marginLeft={20} color="blue.700" />
          }
        </Button>
        {sidebarMenu && (
          <VStack align="start" w="100%" pl={4}>
            <Link href="/dashboard/niveis" passHref>
              <Button w="100%" variant="ghost" color="black" colorScheme="whiteAlpha">
                <ChevronRightIcon color="blue.700" />Níveis
              </Button>
            </Link>
            <Link href="/dashboard/desenvolvedores" passHref>
              <Button w="100%" variant="ghost" color="black" colorScheme="whiteAlpha">
                <ChevronRightIcon color="blue.700" /> Desenvolvedores
              </Button>
            </Link>
          </VStack>
        )}
      </VStack>
    </MotionVStack>
  )
}
