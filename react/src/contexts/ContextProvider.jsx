import { createContext, useContext, useState } from "react";

const ACCESS_TOKEN_FIELD = import.meta.env.VITE_ACCESS_TOKEN_FIELD;
const NOTIFICATION_TIMEOUT = import.meta.env.VITE_NOTIFICATION_TIMEOUT ?? 5000;

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState("");
    const [token, _setToken] = useState(
        localStorage.getItem(ACCESS_TOKEN_FIELD)
    );

    const setNotification = (message) => {
        _setNotification(message);

        setTimeout(() => _setNotification(""), NOTIFICATION_TIMEOUT);
    };

    const setToken = (token) => {
        _setToken(token);

        if (token) {
            console.log(token);
            localStorage.setItem(ACCESS_TOKEN_FIELD, token);
        } else {
            localStorage.removeItem(ACCESS_TOKEN_FIELD);
        }
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                notification,
                setUser,
                setToken,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
