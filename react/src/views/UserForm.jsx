import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const navigate = useNavigate();
    const { setNotification } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const { id } = useParams();

    const onSubmit = (ev) => {
        ev.preventDefault();

        setLoading(true);

        if (user.id) {
            axiosClient
                .put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification(`User was successfully updated`);
                    navigate("/users");
                })
                .catch((err) => {
                    const response = err.response;

                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }

        if (!user.id) {
            axiosClient
                .post(`/users`, user)
                .then(() => {
                    setNotification("User was successfully created");
                    navigate("/users");
                })
                .catch((err) => {
                    const response = err.response;

                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }

        setLoading(false);
    };

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data);
                })
                .catch(() => setLoading(false));
        }, []);
    }

    return (
        <>
            {user.id && <h1>Updating User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <div key={key}>
                                <p style={{ marginTop: "5px" }}>
                                    <small>{key}</small>
                                </p>
                                {errors[key].map((error, index) => (
                                    <p key={`${key}-${index}`}>{error}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            value={user.name}
                            onChange={(ev) =>
                                setUser({ ...user, name: ev.target.value })
                            }
                        />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="E-Mail"
                            value={user.email}
                            onChange={(ev) =>
                                setUser({ ...user, email: ev.target.value })
                            }
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            onChange={(ev) =>
                                setUser({ ...user, password: ev.target.value })
                            }
                        />
                        <input
                            type="password"
                            name="password_confirmation"
                            id="password_confirmation"
                            placeholder="Password Confirmation"
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                        />
                        {user.id && (
                            <button type="submit" className="btn btn-block">
                                Update
                            </button>
                        )}
                        {!user.id && (
                            <button type="submit" className="btn btn-block">
                                Create
                            </button>
                        )}
                    </form>
                )}
            </div>
        </>
    );
}
