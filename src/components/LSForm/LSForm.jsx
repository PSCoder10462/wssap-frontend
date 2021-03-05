import React, { useState } from "react";
import "./LSForm.css";
import FormControl from "@material-ui/core/FormControl";
import { FormHelperText, Input, InputLabel } from "@material-ui/core";
import wssap from "./wssap.png";
import axios from "../../axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";

function LSForm() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState("");

  const handleUser = async (e) => {
    e.preventDefault();
    await axios
      .post("/auth/login", { email, password })
      .then(({ data }) => {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("user", JSON.stringify(data?.user));
        dispatch(login(data?.user));
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="lsform">
      <img src={wssap} alt="whatsapp" />
      <form onSubmit={handleUser}>
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
        <FormControl>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            type="text"
            aria-describedby="my-helper-text"
            onChange={(e) => setName(e.target.value)}
            value={name}
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
          />
        </FormControl>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default LSForm;
