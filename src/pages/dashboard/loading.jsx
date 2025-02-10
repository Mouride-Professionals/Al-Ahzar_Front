import { Box, Spinner, VStack } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="orange.400" thickness="4px" />
        <Text fontSize="lg" fontWeight="bold" color="gray.600">
          Chargement du tableau de bord...
        </Text>
      </VStack>
    </Box>
  );
}
