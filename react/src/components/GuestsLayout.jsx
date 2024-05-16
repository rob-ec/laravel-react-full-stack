import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function GuestsLayout() {
    const { user, token } = useStateContext();

    if (token) {
        return <Navigate to="/" />;
    }
    
    return (
        <div>
            <Outlet />
        </div>
    );
}
