import {
  Box,
  HStack,
  Skeleton,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box w="100vw" minH="100vh" bg="gray.100" p={8} position="relative">
      <VStack spacing={8} align="start" w="100%">
        {/* Simulated Stats Cards */}
        <HStack spacing={8} w="100%">
          <Skeleton height="100px" width="200px" borderRadius="md" />
          <Skeleton height="100px" width="200px" borderRadius="md" />
          <Skeleton height="100px" width="200px" borderRadius="md" />
          <Skeleton height="100px" width="200px" borderRadius="md" />
        </HStack>

        {/* Simulated Dashboard Title */}
        <Skeleton height="40px" width="300px" borderRadius="md" />

        {/* Simulated Data Table / Dataset */}
        <Stack spacing={4} w="100%">
          {/* Table Header */}
          <Skeleton height="40px" borderRadius="md" />
          {/* Table Rows */}
          <Skeleton height="40px" borderRadius="md" />
          <Skeleton height="40px" borderRadius="md" />
          <Skeleton height="40px" borderRadius="md" />
          <Skeleton height="40px" borderRadius="md" />
          {/* Big dataset area */}
          <Skeleton height="300px" width="100%" borderRadius="md" />
        </Stack>
      </VStack>

      {/* Centered Spinner overlay */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        <Spinner size="xl" color="orange.400" thickness="4px" />
        <Text mt={4} fontSize="lg" fontWeight="bold" color="gray.600">
          Loading dashboard...
        </Text>
      </Box>
    </Box>
  );
}
