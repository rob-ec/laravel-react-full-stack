import { useRef, useState } from "react";
import axiosClient from "./../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const { setUser, setToken } = useStateContext();

    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };

        axiosClient
            .post("/signup", payload)
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
                    <h1 className="title">Signup for free</h1>
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
                        ref={nameRef}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Full Name"
                    />
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
                    <input
                        ref={passwordConfirmationRef}
                        type="password"
                        name="password-confirmation"
                        id="password-confirmation"
                        placeholder="Confirm Password"
                    />
                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Alredy registered? <a href="/login">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
