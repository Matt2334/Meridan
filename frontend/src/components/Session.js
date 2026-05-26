"use client";
import { fadeUp } from "./keys";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
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
const A = styled.a`
  text-decoration: none;
  color: inherit;
  `;
export default function Session() {
  const searchParams = useSearchParams();
  const time = searchParams.get("time");
  const topic = searchParams.get("topic");
  const [percentage, setPercentage] = useState(0);
  const [contents, setContents] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/content?time=${time}&topic=${topic}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        if (!res.ok) {
          throw new Error("Failed to fetch content");
        }

        setContents(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    if (time && topic) fetchContent();
  }, [time, topic]);
  const percentIncrement = contents.length > 0 ? 100 / contents.length : 0;
  const updateProgress = () => {
    setPercentage((prev) => Math.min(100, prev + percentIncrement));
  };

  const removeProgress = () => {
    setPercentage((prev) => Math.max(0, prev - percentIncrement));
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/loggedIn`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        setSignedIn(data.authenticated);
      } catch (err) {
        console.error(err);
      }
    };
    checkAuth(); 
  }, []);
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
            removeProgress={removeProgress}
          />
        ))}
      </Content>
      {!signedIn && (
        <div
          style={{
            padding: "16px 20px",
            background: "#eef3fa",
            borderRadius: "10px",
            margin: "24px 0",
          }}
        >
          <p style={{ fontSize: "0.9rem", color: "#4a6fa5" }}>
            Create a free account to save your session history and track your
            progress.
          </p>
          <A href="/signup" >
            Save your progress →
          </A>
        </div>
      )}
    </Wrapper>
  );
}
