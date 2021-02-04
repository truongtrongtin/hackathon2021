import { Box } from "@chakra-ui/react";
import AppContext from "AppContext";
import React, { useContext } from "react";
import { Redirect, Route } from "wouter";
import Header from "./Header";
import Sidebar from "./Sidebar";

type DashboardRouteProps = {
  path: string;
  children: React.ReactChild;
};

export default function DashboardRoute({
  path,
  children,
}: DashboardRouteProps) {
  const { currentUser } = useContext(AppContext);

  // if (!currentUser) return <Redirect to="/login" />;
  return (
    <Route path={path}>
      <Header />
      <Sidebar />
      <Box marginLeft={56} marginTop={14} padding={3}>
        {children}
      </Box>
    </Route>
  );
}
