import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);


    return (
        <UserContext.Provider value={{ user, isAuthenticated, loading, registered, setUser, setIsAuthenticated, setLoading, setRegistered }}>
            {children}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node
}
