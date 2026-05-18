"use client";
import React, { useState } from "react";
import styled from "styled-components";
// :root {
//     --cream: #f5f3ef;
//     --cream-dark: #ede9e3;
//     --charcoal: #1c1c1e;
//     --charcoal-mid: #3a3a3c;
//     --charcoal-light: #6b6b6f;
//     --muted-blue: #4a6fa5;
//     --muted-blue-light: #d4e0f0;
//     --muted-blue-pale: #eef3fa;
//     --warm-white: #faf9f7;
//     --border: rgba(28,28,30,0.1);
//     --shadow-soft: 0 2px 20px rgba(28,28,30,0.06);
//     --shadow-card: 0 4px 32px rgba(28,28,30,0.08);
//     --radius: 16px;
//     --radius-sm: 10px;
//     --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
const Wrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
`;
const Title = styled.h1`
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2.6rem, 5vw, 4rem);
  font-weight: 300;
  line-height: 1.15;
  color: #1c1c1e;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 12px;
`;
const TimeButton = styled.button`
  padding: 12px 22px;
  border-radius: 50px;
  border: 1.5px solid rgba(28, 28, 30, 0.1);
  background: #faf9f7;
  color: #1c1c1e;
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 20px rgba(28, 28, 30, 0.06);

  &:hover {
    border-color: #3a3a3c;
  }
  ${(props) =>
    props.selected &&
    `
    color: #faf9f7;
    background-color: #1c1c1e;
  `}
`;
const TimeInput = styled.input`
  padding: 12px 22px;
  border-radius: 50px;
  border: 1.5px solid #3a3a3c;
  background: #faf9f7;
  color: #1c1c1e;
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 20px rgba(28, 28, 30, 0.06);

  outline: none;
  &:focus {
    border-color: #4a6fa5;
  }
`;
const Begin = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 40px;
  border-radius: 50px;
  background: #1c1c1e;
  color: #f5f3ef;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 32px rgba(28, 28, 30, 0.18);
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
`;
const P = styled.p`
  margin-bottom: 12px;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b6b6f;
`;
const Break = styled.div`
  height: 1px;
  background: rgba(28, 28, 30, 0.1);
  margin: 36px 0;
  width: 40px;
  margin-left: auto;
  margin-right: auto;
`;
const Dropdown = styled.select`
  -webkit-appearance: none;
  padding: 13px 48px 13px 20px;
  border-radius: 50px;
  border: 1.5px solid rgba(28, 28, 30, 0.1);
  background: #faf9f7
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6b6f' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")
    no-repeat right 18px center;
  font-size: 0.9rem;
  color: #1c1c1e;
  cursor: pointer;
  outline: none;
  transition: border-color all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 20px rgba(28, 28, 30, 0.06);
  min-width: 240px;
  margin-bottom: 24px;
`;

const time = [5, 10, 20, 30, 60];
export default function Home() {
  const [customToggle, setCustomToggle] = useState(false);
  const [startToggle, setStartToggle] = useState(false);
  const [customTime, setCustomTime] = useState(1);
  const [selectedTimeToggle, setSelectedTimeToggle] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const updateCustomTime = (e) => {
    const value = e.target.value;
    setCustomTime(value);
    setStartToggle(true);
  };

  const selectTime = () => {
    setCustomToggle(true);
    setSelectedTimeToggle(null);

  };
  const selectTimeToggle = (index) => {
    setSelectedTimeToggle(index)
    setStartToggle(true);
    setCustomToggle(false);
  }

  return (
    <Wrapper>
      <p>DAILY LEARNING SESSIONS</p>
      <Title>How much time do you have today?</Title>
      <p>Turn spare time into intelligence</p>
      <p>Choose your window</p>
      <Grid>
        {time.map((t, i) => (
          <TimeButton
           selected={i === selectedTimeToggle} // pass prop for styling
            onClick={() => selectTimeToggle(i, t)}
            key={i}
          >
            {t} min
          </TimeButton>
        ))}
        <TimeButton style={{ borderStyle: "dashed" }} onClick={selectTime}>
          Custom
        </TimeButton>
      </Grid>
      {customToggle && (
        <TimeInput
          placeholder="Enter minutes..."
          min="1"
          max="180"
          onChange={updateCustomTime}
          onInput={updateCustomTime}
        />
      )}

      <Break />
      <P>What interests you?</P>
      <Dropdown value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
        <option value="">Any topic</option>
        <option value="economics">Economics</option>
        <option value="investing">Investing & Finance</option>
        <option value="ai">Artificial Intelligence</option>
        <option value="philosophy">Philosophy</option>
        <option value="innovation">Innovation</option>
        <option value="science">Science & Nature</option>
        <option value="history">History</option>
        <option value="psychology">Psychology</option>
      </Dropdown>
      <div>
        <a href={`/session?time=${time[selectedTimeToggle]}&topic=${selectedTopic}`}>
          <Begin disabled={!startToggle}>Begin Session →</Begin>
        </a>
      </div>
    </Wrapper>
  );
}
