import { Box, Spinner } from "@chakra-ui/react";

interface LoadingOverlayProps {
  isOpen: boolean;
}

export const LoadingOverlay = ({ isOpen }: LoadingOverlayProps) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.6)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
    >
      <Box
        padding="30px"
        borderRadius="lg"
        boxShadow="xl"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="4"
        minWidth="200px"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    </Box>
  );
};

<LoadingOverlay isOpen={true} />