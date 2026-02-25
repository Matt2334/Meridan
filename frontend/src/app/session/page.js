"use client";
import { fadeUp } from "../../components/keys";
import styled from "styled-components";
import { useState } from "react";
import Card from "../../components/Card";
const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  // padding: 0 16px;
  animation: ${fadeUp} 0.5s ease 0s 1 normal forwards;
`;
const Meta = styled.div`
  display: flex;
  font-size: 0.82rem;
  color: #6b6b6f;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;

  :nth-child(1) {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4a6fa5;
    background: #eef3fa;
    padding: 5px 14px;
    border-radius: 50px;
  }
`;
const Progress = styled.div`
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b6b6f;
`;
const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const Content = styled.div`
  margin-top: 3rem;
`;
export default function Session() {
  let topic = "Philosophy";
  let time = 20;
  const [percentage, setPercentage] = useState(0);
  const contents = [
    {
      title: "Before Adam Smith: Pre-Capitalist Economic Thought",
      desc: "Mercantilism, scholastic just price theory, and why the ancients didn't have economics as a discipline.",
      time: 8,
    },
    {
      title: "Classical Economics: Value, Labor & Accumulation",
      desc: "Smith, Ricardo, and Mill — the foundations of thinking about growth, distribution, and trade.",
      time: 10,
    },
    {
      title: "Marx's Method: A Critical Engagement",
      desc: "The labor theory of value, alienation, and the systemic critique that shaped 150 years of political economy.",
      time: 10,
    },
    {
      title: "The Marginalist Revolution",
      desc: "How the neoclassical school replaced classical concepts with utility, equilibrium, and mathematical formalism.",
      time: 8,
    },
    {
      title: "Keynes vs. Hayek: The 20th Century's Great Debate",
      desc: "Aggregate demand and animal spirits versus spontaneous order and price signals — a debate that never resolved.",
      time: 10,
    },
  ];
  let percentIncrement = 100 / contents.length;
  const updateProgress = () => {
    const newPercentage = percentage+ percentIncrement ;
    setPercentage(newPercentage);
  };
  return (
    <Wrapper>
      <Meta>
        <span>{topic}</span>
        <span>{time} min session</span>
      </Meta>
      <Progress>
        <ProgressHeader>
          <span>Progress</span>
          <span>{percentage}%</span>
        </ProgressHeader>
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "#ede9e3",
            position: "absolute",
          }}
        />
        <div
          className="progress-bar-bg"
          style={{
            width: `${percentage}%`,
            height: "4px",
            background: "#4a6fa5",
            position: "absolute",
          }}
        ></div>
      </Progress>

      <Content>
        {contents.map((content, i) => (
          <Card
            content={content}
            index={i + 1}
            key={i}
            updateProgress={updateProgress}
          />
        ))}
      </Content>
    </Wrapper>
  );
}
