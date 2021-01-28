import { SimpleGrid } from "@chakra-ui/react";
import EmployeeItem from "components/EmployeeItem";
import React, { useEffect, useState } from "react";
import { fetchData } from "services/fetchData";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export default function Employee() {
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setIsLoading(true);
        const user = await fetchData("/users");
        setUsers(user);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getAllUsers();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing="40px">
      {users.map((user: User) => {
        const name = user.firstName + " " + user.lastName;
        return <EmployeeItem key={user.id} name={name} avatar={user.avatar} />;
      })}
    </SimpleGrid>
  );
}
