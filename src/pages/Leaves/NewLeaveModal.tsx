import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import "./date-picker.css";
import { Leave } from "./Leaves";

type NewLeaveProps = {
  leave?: Leave;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (values: NewLeaveInputs) => void;
};

export type NewLeaveInputs = {
  startAt: Date;
  endAt: Date;
  reason: string;
};

const newLeaveSchema = yup.object().shape({
  startAt: yup.date().required(),
  endAt: yup
    .date()
    .min(yup.ref("startAt"), "end time can't be before start time"),
  reason: yup.string().required(),
});

const getNearestStartTime = () => {
  const currentDate = new Date();
  if (currentDate.getHours() < 9) {
    currentDate.setHours(9);
  } else if (currentDate.getHours() < 14) {
    currentDate.setHours(14);
  } else {
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(9);
  }
  currentDate.setMinutes(0, 0, 0);
  return currentDate;
};

const getNearestEndTime = (date: Date) => {
  const currentDate = new Date(date);
  if (currentDate.getHours() < 14) {
    currentDate.setHours(14);
  } else if (currentDate.getHours() < 18) {
    currentDate.setHours(18);
  } else {
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(14);
  }
  currentDate.setMinutes(0, 0, 0);
  return currentDate;
};

function EditLeaveModal({
  leave,
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: NewLeaveProps) {
  const endAtRef = useRef<DatePicker>(null);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    errors,
    control,
  } = useForm<NewLeaveInputs>({
    resolver: yupResolver(newLeaveSchema),
    defaultValues: {
      startAt: leave ? new Date(leave.startAt) : getNearestStartTime(),
      endAt: leave ? new Date(leave.endAt) : getNearestEndTime(new Date()),
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{leave ? "Edit Leave" : "Create Leave"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired isInvalid={Boolean(errors.startAt)} mt={4}>
              <FormLabel htmlFor="startAt">From</FormLabel>
              <Controller
                name="startAt"
                control={control}
                render={({ onChange, value }) => (
                  <DatePicker
                    selected={value}
                    onChange={onChange}
                    onCalendarClose={() => {
                      endAtRef.current?.setOpen(true);
                      setValue("endAt", getNearestEndTime(value));
                    }}
                    showTimeSelect
                    includeTimes={[9, 14].map(
                      (hour) => new Date(new Date().setHours(hour, 0, 0, 0))
                    )}
                    dateFormat="E MMM d, yyyy h:mm aa"
                    selectsStart
                    startDate={value}
                    endDate={watch("endAt")}
                    placeholderText="Select a weekday"
                    autoFocus={!Boolean(leave)}
                    timeIntervals={60}
                    filterDate={(date) =>
                      date.getDay() !== 0 &&
                      date.getDay() !== 6 &&
                      date > new Date()
                    }
                  />
                )}
              />
              <FormErrorMessage>{errors.startAt?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.endAt)} mt={4}>
              <FormLabel htmlFor="endAt">To</FormLabel>
              <Controller
                name="endAt"
                control={control}
                render={({ onChange, value }) => (
                  <DatePicker
                    selected={value}
                    onChange={onChange}
                    showTimeSelect
                    includeTimes={[14, 18].map(
                      (hour) => new Date(new Date().setHours(hour, 0, 0, 0))
                    )}
                    selectsEnd
                    startDate={watch("startAt")}
                    endDate={value}
                    minDate={watch("startAt")}
                    dateFormat="E MMM d, yyyy h:mm aa"
                    placeholderText="Select a weekday"
                    ref={endAtRef}
                    timeIntervals={60}
                    filterDate={(date) =>
                      date.getDay() !== 0 &&
                      date.getDay() !== 6 &&
                      date > new Date()
                    }
                    // @ts-ignore
                    filterTime={(time: Date) => time > watch("startAt")}
                  />
                )}
              />
              <FormErrorMessage>{errors.endAt?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.reason)} mt={4}>
              <FormLabel htmlFor="reason">Reason</FormLabel>
              <Textarea
                ref={register}
                name="reason"
                defaultValue={leave?.reason}
              />
              <FormErrorMessage>{errors.reason?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" type="submit" isLoading={isLoading}>
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditLeaveModal;
