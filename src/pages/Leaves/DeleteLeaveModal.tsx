import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type DeleteLeaveProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: () => void;
};

function DeleteLeaveModal({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
}: DeleteLeaveProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Leave</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure want to delete this leave?</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            type="submit"
            onClick={onSubmit}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteLeaveModal;
