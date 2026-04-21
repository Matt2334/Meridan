"use client";
import styled from "styled-components";
import { useState } from "react";
import {
  analyzePasswordStrength,
  getStrength,
} from "../../components/passwordEvaluator";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h2`
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 300;
  color: #1c1c1e;
  margin-bottom: 8px;
`;
const Span = styled.span`
  font-size: 15px;
  font-weight: 300;
  margin-bottom: 1.75rem;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 35%;
  input {
    margin-bottom: 16px;
    height: 30px;
    padding: 8px 12px;
    font-size: 14px;
    border: 1.5px solid rgba(28, 28, 30, 0.1);
    border-radius: 6px;
    outline: none;
    :focus {
      border-color: rgb(31 30 29 / 15%);
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
      outline: none;
    }
  }
  span {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: rgb(61 61 58);
    margin-bottom: 6px;
  }
`;
const Button = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background: white;
  color: rgb(20 20 19);
  border: 0.5px solid rgb(31 30 29 / 30%);
  border-radius: 10px;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;
  &:hover {
    background: rgb(31 30 29 / 5%);
  }
`;
const Break = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  gap: 5px;
  margin: 1rem 0;
  div {
    flex: 1;
    height: 0.5px;
    background: rgb(31 30 29 / 15%);
  }
  span {
    font-size: 11px;
    color: rgb(115 114 108);
    margin-bottom: 0;
  }
`;
const A = styled.a`
  font-size: 11px;
  color: #6b6b6f;
  text-decoration: none;
  margin-bottom: 16px;
  align-self: end;
`;
export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const strength = getStrength(analyzePasswordStrength(password).score);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Sign up failed");
      }
      const result = await response.json();
      console.log("Sign up successful:", result);
      window.location.href = "/";
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Begin Learning</Title>
      <Span>Create your account in seconds</Span>
      <Form onSubmit={handleSubmit}>
        <span>Email</span>
        <input type="email" name="email" placeholder="Email" required />
        <span>Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="........."
          required
          style={{ marginBottom: "0" }}
        />
        <div style={{display: "flex", gap:'4px', marginTop: '8px'}}>
        {Array.from({length: 4}, (_, i) => (
          <div key={i}style={{flex:"1", height: '2px', background: strength.bars>i &&password?"#4a6fa5":"rgb(31 30 29 / 15%)"}}/>
        ))}
        </div>
        {password && <span>Strength: {strength.label}</span>}
        <Button style={{ marginTop: "16px" }} type="submit">
          Create Account →
        </Button>
        <Break>
          <div></div>
          <span>or</span>
          <div></div>
        </Break>
        <Button
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: "0.5rem",
          }}
          type="button"
          onClick={() => alert("Sign in with Google")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          Sign up with Google
        </Button>
        <A href="/signin" style={{ alignSelf: "center", marginTop: "16px" }}>
          Have an account? <u>Sign in</u>
        </A>
      </Form>
    </Wrapper>
  );
}
