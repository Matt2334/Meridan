"use client";
import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "reactflow";
import styled from "styled-components";
import { useState } from "react";

const Tooltip = styled.div`
  position: absolute;
  background: #faf9f7;
  border: 0.5px solid rgba(28,28,30,0.1);
  border-radius: 12px;
  padding: 10px 14px;
  pointer-events: none;
  max-width: 220px;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
`;
const Reason = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.88rem;
  font-style: italic;
  font-weight: 300;
  color: #1c1c1e;
  line-height: 1.5;
  margin: 0;
`;
const Strength = styled.p`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4a6fa5;
  margin: 0 0 4px;
`;

export default function ConnectionEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  style,
  data,
}) {
  const [hovered, setHovered] = useState(false);
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          cursor: 'pointer',
          strokeOpacity: hovered ? 1 : 0.5,
          transition: 'stroke-opacity 0.2s',
        }}
      />
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={12}
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <EdgeLabelRenderer>
        <Tooltip
          $visible={hovered}
          style={{
            position: 'absolute',
            left: labelX,
            top: labelY,
          }}
          className="nodrag nopan"
        >
          <Strength>{Math.round(data?.strength * 100)}% related</Strength>
          <Reason>{data?.reason}</Reason>
        </Tooltip>
      </EdgeLabelRenderer>
    </>
  );
}