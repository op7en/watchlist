import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { loginSuccess } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";
import API from "../api/axios";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warn("Fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await API.post(endpoint, { email, password });

      if (isLogin) {
        dispatch(loginSuccess(res.data));
      } else {
        toast.success("Account created. Now log in.");
        setIsLogin(true);
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>
        <p className="auth-subtitle">
          {isLogin ? "Welcome back" : "Create your account"}
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn-primary"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <span className="btn-spinner" />
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
        <button className="btn-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "No account? Register" : "Have account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
