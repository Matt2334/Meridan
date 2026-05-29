"use client";
import styled from "styled-components";
import { useState } from "react";

const Wrapper = styled.div`
  background: ${({ $marked }) =>
    $marked ? "rgb(212 211 209 / 50%)" : "#faf9f7"};
  border: 1px solid rgba(28, 28, 30, 0.1);
  border-radius: 16px;
  padding: 24px 28px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 2px 20px rgba(28, 28, 30, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card);
  }

  .time {
    font-family: "Cormorant Garamond", serif;
    font-size: 1.1rem;
    font-weight: 300;
    color: #6b6b6f;
    min-width: 28px;
    margin-top: 2px;
  }
`;
const Title = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #1c1c1e;
  margin-bottom: 6px;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 0.88rem;
  color: #6b6b6f;
  font-weight: 300;
  line-height: 1.55;
  margin-bottom: 14px;
`;

const CardFooter = styled.div`
  display: flex;
  font-size: 0.78rem;
  color: #6b6b6f;
  letter-spacing: 0.04em;
  align-items: center;
  gap: 12px;
`;

const Button = styled.a`
  padding: 7px 18px;
  border-radius: 50px;
  border: 1.5px solid rgba(28, 28, 30, 0.1);
  background: transparent;
  font-family: "DM Sans", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ $marked }) =>
    $marked ? "rgb(28, 28, 30, 0.8)" : "transparent"};
  color: ${({ $marked }) => ($marked ? "#faf9f7" : "#1c1c1e")};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
  text-decoration: none;
  ${(props) =>
    props.secondary &&
    `
    background: #1c1c1e;
    color: #f5f3ef;
    border-color: #1c1c1e;
    box-shadow: 0 4px 20px rgba(28, 28, 30, 0.15);
    `}
`;

export default function Card({
  content,
  index,
  sessionId,
  updateProgress,
  removeProgress,
}) {
  const [marked, setMarked] = useState(false);
  const handleProgress = async () => {
    if (marked) {
      removeProgress();
    } else {
      updateProgress();
      if (sessionId) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/items/${content.sessionItemId}/read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
    }
    setMarked(!marked);
  };
  
  return (
    <Wrapper $marked={marked}>
      <span className="time">{index}</span>
      <div>
        <Title>{content.title}</Title>
        <Description>{content.description}</Description>
        <CardFooter>
          <span>{content.estimatedTime} min</span>
          <Button $marked={marked} primary="true" href={content.sourceUrl}>
            Open
          </Button>
          <Button onClick={handleProgress} secondary="true">
            Mark as read
          </Button>
        </CardFooter>
      </div>
    </Wrapper>
  );
}
