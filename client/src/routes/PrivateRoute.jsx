import { useSelector } from "react-redux";
import { selectedUserData } from "@/store/slices/authSlice";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const userData = useSelector(selectedUserData);

    const isAuthenticate = !userData;

    return isAuthenticate ? <Navigate to={"/auth"} /> : children;
};

export default PrivateRoute;
