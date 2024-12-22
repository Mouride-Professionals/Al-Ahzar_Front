import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { fetcher } from 'src/lib/api';

export const CreateSchoolForm = ({ token, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetcher({
        uri: '/schools',
        options: {
          method: 'POST',
          body: JSON.stringify({
            name,
            description,
          }),
        },
        user_token: token,
      });

      toast({
        title: 'School created.',
        description: `The school "${response.data.name}" has been successfully created.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error creating school.',
        description:
          error?.response?.data?.message || 'An unexpected error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>School Name</FormLabel>
          <Input
            placeholder="Enter school name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Enter a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <VStack spacing={2} align="stretch">
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            loadingText="Creating"
          >
            Create School
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};
