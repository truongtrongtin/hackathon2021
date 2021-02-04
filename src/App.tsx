// @ts-nocheck
import {
  Box,
  Button,
  Img,
  Spinner,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { fetchData } from "services/fetchData";
import banner from "assets/images/banner.png"; // Tell webpack this JS file uses this image

function App() {
  // const [, setLocation] = useLocation();
  // const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<any>([]);
  const [voted, setVoted] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    const checkAuth = async () => {
      try {
        const records = await fetchData("/records");
        setRecords(records);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [voted]);

  useEffect(() => {
    setVoted(localStorage.getItem("voted"));
    setRecordId(localStorage.getItem("recordId"));
  }, []);

  const vote = (currentVotes, currentRecordId) => {
    const updateVotes = async () => {
      setIsLoading(true);
      try {
        await fetchData("/records", {
          headers: {
            Authorization: "ApiKey Bbk6fUp5oE6oWT",
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify([
            {
              id: currentRecordId,
              cells: [
                {
                  columnId: "votes",
                  value: currentVotes ? currentVotes + 1 : 1,
                },
              ],
            },
          ]),
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    updateVotes();
    setVoted(true);
    localStorage.setItem("voted", true);
    setRecordId(currentRecordId);
    localStorage.setItem("recordId", currentRecordId);
  };

  // if (isLoading) {
  //   return (
  //     <Spinner
  //       position="fixed"
  //       top="50%"
  //       left="50%"
  //       transform="translate(-50%, -50%)"
  //     />
  //   );
  // }

  return (
    <>
      <Img src={banner} />
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 450: 1, 600: 2, 960: 3, 1280: 4 }}
      >
        <Masonry>
          {records.map((record) => {
            return (
              <Box
                key={record.id}
                padding={2}
                _hover={{
                  cursor: "pointer",
                  background: "#FFE1ED",
                }}
              >
                <Img
                  src={`https://api.gridly.com/v1/views/medej8v1n0qyl8/files/${record?.cells?.[0]?.value?.[0]}`}
                />
                <Box bottom={5} left={5}>
                  <span style={{ fontSize: "20px" }}>&#127800;</span>
                  <Text ml={1} as="span">
                    <Text as="span">Name: </Text>
                    <Text as="span" fontWeight="bold">
                      {record?.cells?.[1]?.value}
                    </Text>
                  </Text>
                  <Text>Age: {record?.cells?.[2]?.value}</Text>
                  <Text>Height: {record?.cells?.[3]?.value}</Text>
                  <Text>Weight: {record?.cells?.[4]?.value}</Text>
                  <Text>Measurements: {record?.cells?.[5]?.value}</Text>
                  <Text>Job: {record?.cells?.[6]?.value}</Text>
                  {voted && !isLoading && (
                    <Text>Votes: {record?.cells?.[7]?.value || 0}</Text>
                  )}
                  {!voted && !isLoading && (
                    <Button
                      mt={2}
                      variant="outline"
                      colorScheme="red.50"
                      onClick={() => vote(record?.cells?.[7]?.value, record.id)}
                    >
                      Vote
                    </Button>
                  )}
                  {isLoading && <Spinner />}
                  {recordId === record.id && !isLoading && (
                    <Tag
                      size="lg"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="green"
                    >
                      <TagLabel>Voted</TagLabel>
                      <TagRightIcon as={AiOutlineCheckCircle} />
                    </Tag>
                  )}
                </Box>
              </Box>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}

export default App;
