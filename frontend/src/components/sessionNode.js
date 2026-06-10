"use client";
import styled from "styled-components";
import { useState } from "react";
import { Handle, Position } from "reactflow";
const Wrapper = styled.div`
  height: ${({ $height }) => $height}px;
  width: ${({ $width }) => $width}px;
  border-radius: 100%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const Popup = styled.div`
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
//   bottom: calc(100% + 8px);
  left: 90%;
  background: #faf9f7;
  border: 0.5px solid rgba(28,28,30,0.1);
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 160px;
  pointer-events: none;
  z-index: 10;
  white-space: nowrap;
`;
const Meta = styled.div`
  font-size: 11px;
  color: #6b6b6f;
  font-weight: 300;
  display: flex;
  gap: 6px;
  text-align: center;
`;
const Topic = styled.p`
  color: #4a6fa5;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
`;
const Title = styled.p`
  font-family: "Cormorant Garamond", serif;
  font-size: 0.9rem;
  color: #1c1c1e;
  margin: 0 0 4px;
  line-height: 1.3;
`;
export default function SessionNode({ data }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <Wrapper
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      $height={data.height}
      $width={data.width}
      $color={data.color}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Popup $visible={isHover}>
        <Topic>{data.topic}</Topic>
        <Title>{data.title}</Title>
        <Meta>
          <span>{data.date}</span>
          <span>.</span>
          <span>{data.time} min</span>
        </Meta>
      </Popup>
    </Wrapper>
  );
}
