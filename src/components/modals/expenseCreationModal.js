import {
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { CreateExpenseForm } from "@components/forms/expense/create";
import { colors } from "@theme";
import { useTranslations } from "next-intl";
import { SiGoogleclassroom } from "react-icons/si";

export const ExpenseCreationModal = ({ isOpen, onClose, token, schoolId,schoolYearId,setHasSucceeded }) => {
    const t = useTranslations();
    return (
        <Modal size={"3xl"} onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bgColor={colors.secondary.light}>
                    <HStack>
                        <SiGoogleclassroom color={colors.secondary.regular} size={25} />
                        <Text>{t('components.dataset.expenses.create')}</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <CreateExpenseForm action={onClose} school={schoolId} schoolYear={schoolYearId} token={token} setHasSucceeded={setHasSucceeded} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};