import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import AppLink from "components/AppLink";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { fetchData } from "services/fetchData";
import { useLocation } from "wouter";
import * as yup from "yup";

type SignupInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const loginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

export default function Signup() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: SignupInputs) => {
    setIsLoading(true);
    try {
      await fetchData("/auth/signup", {
        method: "POST",
        body: new URLSearchParams({ email, password, firstName, lastName }),
      });
      setIsLoading(false);
      setShowPassword(false);
      setError("");
      setLocation("/login");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
      setIsLoading(false);
      setShowPassword(false);
    }
  };

  return (
    <Flex align="center" height="100vh" justifyContent="center">
      <Box width="400px" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading>Signup</Heading>
        </Box>
        <Box my={4}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert my={4} status="error" borderRadius={4}>
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <SimpleGrid columns={2} spacing={2}>
              <FormControl isRequired isInvalid={Boolean(errors.firstName)}>
                <FormLabel htmlFor="firstName">First name</FormLabel>
                <Input
                  autoFocus
                  type="text"
                  name="firstName"
                  ref={register}
                  size="lg"
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={Boolean(errors.lastName)}>
                <FormLabel htmlFor="lastName">Last name</FormLabel>
                <Input
                  autoFocus
                  type="text"
                  name="lastName"
                  ref={register}
                  size="lg"
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
            <FormControl isRequired isInvalid={Boolean(errors.email)} mt={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                autoFocus
                type="email"
                name="email"
                ref={register}
                size="lg"
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.password)} mt={4}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  ref={register}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Toggle password"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={
                      showPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button
              width="full"
              colorScheme="teal"
              variant="outline"
              type="submit"
              mt={8}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Box>
        <Box textAlign="center">
          <Text>
            Already have an account?{" "}
            <AppLink color="teal.600" href="/login">
              Login here
            </AppLink>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
