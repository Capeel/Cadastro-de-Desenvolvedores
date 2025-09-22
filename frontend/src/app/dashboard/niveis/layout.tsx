'use client'

import { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'

export default function NiveisLayout({ children }: { children: ReactNode }) {
  return (
    <Flex
      minH="100vh"
    >
      <Box flex="1" bgColor="white">
        {children}
      </Box>
    </Flex>
  )
}
