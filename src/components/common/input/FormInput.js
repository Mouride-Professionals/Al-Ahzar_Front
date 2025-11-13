import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { colors } from '@theme';
import { ErrorMessage } from 'formik';
import { useTranslations } from 'next-intl';
import { BsFiletypeXlsx } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

export const FormInput = ({
  select,
  options = [],
  textArea,
  uid,
  label,
  errors,
  placeholder,
  handleChange,
  handleBlur,
  touched,
  type,
  value,
  py,
  isDisabled,
}) => {
  const inputProps = {
    bgColor: colors.white,
    name: uid,
    onChange: handleChange,
    onBlur: handleBlur,
    borderColor: colors.gray.regular,
    placeholder: placeholder,
    type: type || 'text',
    value: value,
    h: 50,
    w: '100%',
    isDisabled,
  };
  return (
    <FormControl {...(py && { py: py })} isInvalid={errors[uid]}>
      <FormLabel fontWeight={'bold'}>{label}</FormLabel>
      {textArea ? (
        <Textarea p={5} minH={220} maxH={220} {...inputProps} />
      ) : select ? (
        <Select {...inputProps}>
          {options.map((option, i) => (
            <option value={option.value} key={`${uid}-option-${i}`}>
              {option.name}
            </option>
          ))}
        </Select>
      ) : (
        <Input {...inputProps} />
      )}
      {errors[uid] && touched[uid] && (
        <FormErrorMessage>{errors[uid]}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export const FormSubmit = ({
  uid,
  touched,
  errors,
  submit_message,
  handleSubmit,
  isSubmitting,
  pt,
  pb,
}) => {
  const t = useTranslations('components.formInput');
  return (
    <FormControl {...{ pt, pb }}>
      <Button
        mb={3}
        onClick={handleSubmit}
        colorScheme={colors.colorScheme.orange}
        bgColor={colors.primary.regular}
        h={50}
        w={'100%'}
        type={'submit'}
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
      >
        {submit_message || t('submit')}
      </Button>
      {errors[uid] && touched[uid] && (
        <VStack>
          <ErrorMessage
            style={{ color: colors.error }}
            render={(errorMessage) => (
              <Text color={colors.error}>{errorMessage}</Text>
            )}
            name={uid}
          />
        </VStack>
      )}
    </FormControl>
  );
};

export const FormSearch = ({
  placeholder,
  onChange,
  onSearch,
  value,
  onClear,
}) => {
  const t = useTranslations('components.formInput');
  const showClear = value && value.trim().length > 0;

  return (
    <InputGroup>
      <Input
        ml={3}
        h={45.01}
        onChange={onChange}
        value={value}
        placeholder={placeholder || t('search')}
        pr={showClear ? '7.5rem' : '4.5rem'}
      />
      <InputRightElement
        alignSelf={'center'}
        h={'100%'}
        width={showClear ? '7.5rem' : '4.5rem'}
      >
        {showClear && (
          <IconButton
            aria-label={'Clear'}
            icon={<IoClose size={20} />}
            variant="ghost"
            onClick={onClear}
            h="100%"
            color={colors.gray.regular}
            px={2}
          />
        )}
        <IconButton
          aria-label={t('search', { fallback: 'Search' })}
          icon={<FiSearch size={20} />}
          variant="ghost"
          onClick={onSearch}
          h="100%"
          color={colors.primary.regular}
          px={2}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export const FormExport = ({ onExport }) => {
  const t = useTranslations('components.formInput');
  return (
    <Button
      leftIcon={<BsFiletypeXlsx size={25} />}
      color={colors.gray.regular}
      fontSize={14}
      variant={'outline'}
      h={45.2}
      borderRadius={10}
      px={3}
      onClick={(e) => onExport(e.target.value)}
    >
      {t('export')}
    </Button>
  );
};

export const FormFilter = ({ onExport }) => {
  const t = useTranslations('components.formInput');
  return (
    <Button
      leftIcon={<CiFilter size={25} />}
      mr={2}
      color={colors.gray.regular}
      fontSize={14}
      variant={'outline'}
      h={45.2}
      borderRadius={10}
      px={3}
    >
      {t('filter')}
    </Button>
  );
};

export const StudentFilter = ({ onFilter, label, bgColor, color }) => (
  <Button
    leftIcon={<CiFilter size={25} />}
    color={color}
    fontSize={14}
    mr={2}
    variant={'outline'}
    bg={bgColor}
    h={45.2}
    borderRadius={10}
    px={3}
    onClick={onFilter}
  >
    {label}
  </Button>
);
