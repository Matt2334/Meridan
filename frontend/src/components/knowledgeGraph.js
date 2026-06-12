"use client";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import styled from "styled-components";
import SessionNode from "./sessionNode";
import ConnectionEdge from "./connectionEdge";

const Wrapper = styled.div`
  height: 600px;
  width: 100%;
  padding-bottom: 3rem;
`;
const Legend = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;
const D = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;

  div {
    border-radius: 100%;
    height: 10px;
    width: 10px;
    background-color: ${({ $color }) => $color};
  }
  span {
    font-size: 11px;
  }
`;
const nodeTypes = {
  sessionNode: SessionNode,
};
const edgeTypes = {
    connectionEdge: ConnectionEdge,
}
const TOPIC_COLORS = {
  ECONOMICS: "rgb(122, 137, 92)",
  INVESTING: "rgb(92, 126, 104)",
  AI: "rgb(86, 142, 111)",
  PHILOSOPHY: "rgb(131, 109, 168)",
  INNOVATION: "rgb(87, 141, 153)",
  SCIENCE: "rgb(88, 122, 168)",
  HISTORY: "rgb(148, 115, 89)",
  PSYCHOLOGY: "rgb(169, 116, 139)",
};
export default function KnowledgeGraph({ sessions, connections }) {
  const p = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 250;
    return {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    };
  };
  const nodes = sessions.map((session, index) => ({
    id: String(session.id),
    position: p(index, sessions.length),
    type: "sessionNode",
    data: {
      topic: session.topic,
      title: session.title || "...",
      date: new Date(session.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: session.timeAvailable,
      color: TOPIC_COLORS[session.topic] || "#4a6fa5",
      height: 10,
      width: 10,
    },
  }));
  const edges = connections.map((conn) => ({
    id: `${conn.fromSessionId}-${conn.toSessionId}`,
    source: String(conn.fromSessionId),
    target: String(conn.toSessionId),
    data: {
      reason: conn.reason,
      strength: conn.strength,
    },
    animated: false,
    style: { stroke: "#b7cce9", strokeWidth: conn.strength * 3 },
    type: 'connectionEdge',
  }));
  return (
    <Wrapper>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="#ede9e3" gap={24} />
        {/* <Controls /> */}
      </ReactFlow>
      <Legend>
        {Object.entries(TOPIC_COLORS).map(([topic, color], i) => (
          <D key={i} $color={color}>
            <div />
            <span>{topic.charAt(0) + topic.slice(1).toLowerCase()}</span>
          </D>
        ))}
      </Legend>
    </Wrapper>
  );
}
