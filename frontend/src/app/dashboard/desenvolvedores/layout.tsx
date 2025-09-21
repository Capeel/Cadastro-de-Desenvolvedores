'use client'

import { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'

export default function DesenvolvedoresLayout({ children }: { children: ReactNode }) {
  return (
    <Flex
      minH="100vh"
    >
      <Box flex="1" bgColor="#4a5568">
        {children}
      </Box>
    </Flex>
  )
}
