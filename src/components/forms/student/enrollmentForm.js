import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import Select from 'react-select';

const ReEnrollmentModal = ({
  isOpen,
  onClose,
  firstname,
  lastname,
  level,
  classroomOptions,
  selectedClassroom,
  setSelectedClassroom,
  handleReEnrollment,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={1500}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {firstname || ''} {lastname || ''} a finis la classe {level || ''}
        </ModalHeader>
        <ModalBody>
          <Text mb={4}>
            <strong>Réinscrire l'élève dans la classe:</strong>{' '}
            {classroomOptions.find(
              (option) => option.value === selectedClassroom
            )?.label || '...'}
          </Text>

          <Select
            options={classroomOptions}
            value={classroomOptions.find(
              (option) => option.value === selectedClassroom
            )}
            onChange={(selectedOption) =>
              setSelectedClassroom(selectedOption.value)
            }
            placeholder="Select a classroom"
            isSearchable
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="gray" mr={3}>
            Cancel
          </Button>

          <Button
            onClick={handleReEnrollment}
            colorScheme="orange"
            isDisabled={!selectedClassroom}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReEnrollmentModal;