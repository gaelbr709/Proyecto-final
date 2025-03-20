import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRol, setUserRol] = useState(null); 
  const [userToken, setUserToken] = useState(null);
  const [userid, setUserid] = useState(null);
  const [username, Setusername] = useState(null);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      userRol, 
      setUserRol, 
      userToken, 
      setUserToken,
      userid,
      setUserid,
      username,
      Setusername
    }}>
      {children}
    </AuthContext.Provider>
  );
};
