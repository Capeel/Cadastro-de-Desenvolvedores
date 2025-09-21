'use client'

import { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Sidebar from '@/components/sidebar'
import { motion } from 'framer-motion'

const FlexMotion = motion(Flex)

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FlexMotion
      minH="100vh"
      initial={{ z: -500, opacity: 0, backgroundColor: "#4A5568" }}
      animate={{ z: 0, opacity: 1, backgroundColor: "#2D3748" }}
      exit={{ z: 50, opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Sidebar />
      <Box flex="1">
        {children}
      </Box>
    </FlexMotion>
  )
}
