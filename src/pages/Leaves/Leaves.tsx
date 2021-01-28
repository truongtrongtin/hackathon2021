import React from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import LDTable from "components/LDTable/LDTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiChevronDown, BiDotsVerticalRounded } from "react-icons/bi";
import { fetchData } from "services/fetchData";
import NewLeaveModal from "./NewLeaveModal";
import DeleteLeaveModal from "./DeleteLeaveModal";
import { User } from "../Employee/Employee";
import { NewLeaveInputs } from "./NewLeaveModal";

export type Leave = {
  id: number;
  startAt: Date;
  endAt: Date;
  noOfDays: any;
  reason: string;
  status: string;
  user: User;
};

enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

function calculateLeaveDays(startDate: Date, endDate: Date) {
  const totalHours = (endDate.getTime() - startDate.getTime()) / 1000 / 3600;
  const remainder = totalHours % 24;
  let remainWorkDay;
  if (remainder === 0) {
    remainWorkDay = 0;
  } else if (remainder >= 9) {
    remainWorkDay = 1;
  } else {
    remainWorkDay = 0.5;
  }
  let numWorkDays = 0;
  while (startDate <= endDate) {
    if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
      numWorkDays++;
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return numWorkDays - 1 + remainWorkDay;
}

function Leaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<Leave>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  useEffect(() => {
    const getAllLeaves = async () => {
      try {
        setIsLoading(true);
        const leaves = await fetchData("/leaves");
        setLeaves(leaves);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getAllLeaves();
  }, []);

  const createLeave = async ({ startAt, endAt, reason }: NewLeaveInputs) => {
    setIsLoading(true);
    try {
      const newLeave = await fetchData(`/leaves`, {
        method: "POST",
        body: new URLSearchParams({
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          reason,
        }),
      });
      setIsLoading(false);
      setLeaves([newLeave, ...leaves]);
      onCloseCreate();
    } catch (error) {
      setIsLoading(false);
      onCloseCreate();
    }
  };

  const updateLeave = async ({ startAt, endAt, reason }: NewLeaveInputs) => {
    if (!selectedLeave) return;
    setIsLoading(true);
    try {
      let newLeave: Leave;
      const body = new URLSearchParams({
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        reason,
      });
      newLeave = await fetchData(`/leaves/${selectedLeave.id}`, {
        method: "PATCH",
        body,
      });
      const newLeaves = leaves.map((leave) => {
        if (leave.id === newLeave.id) return newLeave;
        return leave;
      });
      setLeaves(newLeaves);
      setIsLoading(false);
      onCloseEdit();
    } catch (error) {
      setIsLoading(false);
      onCloseEdit();
    }
  };

  const changeLeaveStatus = useCallback(
    async (leave: Leave, status: LeaveStatus) => {
      if (leave.status === status) return;
      try {
        setIsLoading(true);
        const newLeave = await fetchData(`/leaves/${leave.id}/status`, {
          method: "PATCH",
          body: new URLSearchParams({ status }),
        });
        const newLeaves = leaves.map((leave) => {
          if (leave.id === newLeave.id) return { ...leave, status };
          return leave;
        });
        setIsLoading(false);
        setLeaves(newLeaves);
      } catch (error) {
        setIsLoading(false);
      }
    },
    [leaves]
  );

  const deleteLeave = useCallback(async () => {
    if (!selectedLeave) return;
    try {
      setIsLoading(true);
      await fetchData(`/leaves/${selectedLeave.id}`, {
        method: "DELETE",
      });
      const newLeaves = leaves.filter((l) => l.id !== selectedLeave.id);
      setIsLoading(false);
      onCloseDelete();
      setLeaves(newLeaves);
    } catch (error) {
      setIsLoading(false);
    }
  }, [leaves, selectedLeave, onCloseDelete]);

  const data = useMemo(
    () =>
      leaves.map((leave) => {
        return {
          employee: leave.user.firstName + " " + leave.user.lastName,
          startAt: new Date(leave.startAt).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          endAt: new Date(leave.endAt).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          noOfDays: calculateLeaveDays(
            new Date(leave.startAt),
            new Date(leave.endAt)
          ),
          reason: leave.reason,
          status: (
            <Menu>
              <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                {leave.status}
              </MenuButton>
              <MenuList>
                {Object.values(LeaveStatus).map((status) => (
                  <MenuItem
                    key={status}
                    onClick={() => changeLeaveStatus(leave, status)}
                  >
                    {status}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ),
          action: (
            <Menu>
              <MenuButton as={IconButton} icon={<BiDotsVerticalRounded />} />
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setSelectedLeave(leave);
                    onOpenEdit();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedLeave(leave);
                    onOpenDelete();
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          ),
        };
      }),
    [leaves, changeLeaveStatus, onOpenDelete, onOpenEdit]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Employee",
        accessor: "employee",
      },
      {
        Header: "Start At",
        accessor: "startAt",
      },
      {
        Header: "End At",
        accessor: "endAt",
      },
      {
        Header: "No Of Days",
        accessor: "noOfDays",
      },
      {
        Header: "Reason",
        accessor: "reason",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  );

  return (
    <Box>
      <Button onClick={onOpenCreate}>Add Leave</Button>
      <LDTable data={data} columns={columns} />
      <NewLeaveModal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
        isLoading={isLoading}
        onSubmit={createLeave}
      />
      <NewLeaveModal
        leave={selectedLeave}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        isLoading={isLoading}
        onSubmit={updateLeave}
      />
      <DeleteLeaveModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        isLoading={isLoading}
        onSubmit={deleteLeave}
      />
    </Box>
  );
}

export default Leaves;
