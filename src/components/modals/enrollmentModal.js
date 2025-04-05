import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { EnrollmentForm } from '@components/forms/student/enrollmentForm';

const ReEnrollmentModal = ({
    token,
    isOpen,
    onClose,
    firstname,
    lastname,
    level,
    student,
    classroomOptions,
    selectedClassroom,
    setSelectedClassroom,
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

                    <EnrollmentForm classroomOptions={classroomOptions} selectedClassroom={selectedClassroom} setSelectedClassroom={setSelectedClassroom} student={student} token={token} action={onClose} />


                </ModalBody>

            </ModalContent>
        </Modal>
    );
};

export default ReEnrollmentModal;