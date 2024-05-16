import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    const onDelete = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        axiosClient.delete(`/users/${user.id}`).then(() => {
            setNotification("User successfully deleted");
            getUsers();
        });
    };

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get("/users")
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(getUsers, []);

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">
                    New User
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>E-Mail</th>
                            <th>Creation Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users &&
                                users.map((userInfo) => (
                                    <tr key={`user-info-${userInfo.id}`}>
                                        <td>{userInfo.id}</td>
                                        <td>{userInfo.name}</td>
                                        <td>
                                            <Link
                                                to={`mailto:${userInfo.email}`}
                                            >
                                                {userInfo.email}
                                            </Link>
                                        </td>
                                        <td>{userInfo.created_at}</td>
                                        <td>
                                            <Link
                                                to={`/users/${userInfo.id}`}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button
                                                className="btn-delete"
                                                onClick={(ev) =>
                                                    onDelete(userInfo)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
