import React, { useState } from "react";
import "./LSForm.css";
import FormControl from "@material-ui/core/FormControl";
import { Input, InputLabel } from "@material-ui/core";
import wssap from "./wssap.png";
import axios from "../../axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";

function LSForm() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [register, setRegister] = useState(false),
    [invalid, setInvalid] = useState(false);

  const loginUser = (e) => {
    e.preventDefault();
    axios
      .post("/auth/login", { email, password })
      .then(({ data }) => {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        dispatch(login(data?.user));
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((err) => {
        setInvalid(true);
        console.log(err);
      });
  };

  const signupUser = (e) => {
    e.preventDefault();
    axios
      .post("/auth/signup", { name, email, password })
      .then(({ data }) => {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        dispatch(login(data?.user));
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((err) => {
        setInvalid(true);

        console.log(err);
      });
  };

  const signup = (
    <>
      <form onSubmit={signupUser}>
        <FormControl>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            type="text"
            aria-describedby="my-helper-text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            id="email"
            type="email"
            aria-describedby="my-helper-text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            aria-describedby="my-helper-text"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </FormControl>
        <button type="submit">Sign Up</button>
      </form>
      <p className="signInMethod">
        Existing user?{" "}
        <span onClick={() => setRegister(!register)}>Sign In</span>
      </p>
    </>
  );

  const signin = (
    <>
      <form onSubmit={loginUser}>
        <FormControl>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            id="email"
            type="email"
            aria-describedby="my-helper-text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            aria-describedby="my-helper-text"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </FormControl>
        <button type="submit">Login</button>
      </form>
      <p className="signInMethod">
        New user? <span onClick={() => setRegister(!register)}>Register</span>
      </p>
    </>
  );

  const errMessage = <p className="errMessage">Invalid email/password</p>;

  return (
    <div className="lsform">
      <img src={wssap} alt="whatsapp" />
      {register && signup}
      {!register && signin}
      {invalid && errMessage}
    </div>
  );
}

export default LSForm;
