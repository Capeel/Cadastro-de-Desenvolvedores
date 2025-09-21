import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  HStack
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  isLoading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}: PaginationProps) => {

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Se temos 5 páginas ou menos, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com "..."
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Box>
      <Flex justify="center" align="center">
        <HStack spacing={1}>
          {/* Primeira página */}
          <IconButton
            aria-label="Primeira página"
            icon={<ArrowLeftIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(1)}
            isDisabled={currentPage === 1 || isLoading}
            _hover={{ bg: 'gray.100' }}
          />

          {/* Página anterior */}
          <IconButton
            aria-label="Página anterior"
            icon={<ChevronLeftIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1 || isLoading}
            _hover={{ bg: 'gray.100' }}
          />

          {/* Números das páginas */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <Text px={2} color="gray.500">
                  ...
                </Text>
              ) : (
                <Button
                  size="sm"
                  variant={currentPage === page ? "solid" : "ghost"}
                  colorScheme={currentPage === page ? "blue" : "gray"}
                  onClick={() => onPageChange(page as number)}
                  isDisabled={isLoading}
                  _hover={currentPage !== page ? { bg: 'gray.100' } : undefined}
                  minW="40px"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Próxima página */}
          <IconButton
            aria-label="Próxima página"
            icon={<ChevronRightIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages || isLoading}
            _hover={{ bg: 'gray.100' }}
          />

          {/* Última página */}
          <IconButton
            aria-label="Última página"
            icon={<ArrowRightIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(totalPages)}
            isDisabled={currentPage === totalPages || isLoading}
            _hover={{ bg: 'gray.100' }}
          />
        </HStack>
      </Flex>
    </Box>
  );
};