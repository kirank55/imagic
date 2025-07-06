"use client";
import React from "react";
import { UserContextType } from "./types";
// This file defines a context for managing user-related data in a React application.
const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;
