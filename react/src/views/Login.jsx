import { useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const { setUser, setToken } = useStateContext();

    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setToken(data.token);
                setUser(data.user);
            })
            .catch((err) => {
                const response = err.response;

                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Login into your account</h1>
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
                    <input
                        ref={emailRef}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="E-Mail"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                    />
                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not registered? <a href="/signup">Create an account</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
