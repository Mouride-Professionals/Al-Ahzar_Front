import { Button, FormControl } from '@chakra-ui/react';
import { colors } from '@theme';

export const SecondaryButton = ({ onClick, message, h }) => {
  return (
    <FormControl>
      <Button
        borderWidth={2}
        borderColor={colors.black}
        h={h || 45.01}
        w={'100%'}
        mb={3}
        onClick={onClick}
        variant={'outline'}
      >
        {message}
      </Button>
    </FormControl>
  );
};

export const PrimaryButton = ({ onClick, message }) => {
  return (
    <FormControl>
      <Button
        colorScheme={'orange'}
        bgColor={colors.primary.regular}
        h={45.01}
        w={'100%'}
        mb={3}
        onClick={onClick}
      >
        {message}
      </Button>
    </FormControl>
  );
};
