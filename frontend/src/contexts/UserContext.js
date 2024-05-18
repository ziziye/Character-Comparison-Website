// src/contexts/UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    isAdmin: false,
    username: '',
    email: '',
    recentComparison:[]
  });

  const setRecentComparison = (comparisons) => {
    setUser(prevUser => ({
      ...prevUser,
      recentComparison: comparisons
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, setRecentComparison }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
