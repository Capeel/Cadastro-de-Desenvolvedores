'use client'

import { ReactNode } from 'react'
import { Box, Flex, HStack } from '@chakra-ui/react'
import Sidebar from '@/components/sidebar'
import { motion } from 'framer-motion'

const FlexMotion = motion(Flex)

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FlexMotion
      minH="100vh"
      bgColor="white"
    >
      <Sidebar />
      <Box flex="1">
        {children}
      </Box>
    </FlexMotion>
  )
}
