"use client";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import styled from "styled-components";
import SessionNode from "./sessionNode";
const Wrapper = styled.div`
  height: 600px;
  width: 100%;
`;
const nodeTypes = {
  sessionNode: SessionNode,
};
const TOPIC_COLORS = {"PSYCHOLOGY":"blue", "AI":"Green"};
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
      title: session.title || "unset",
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
    animated: false,
    style: { stroke: "#d4e0f0", strokeWidth: conn.strength * 3 },
  }));
  return (
    <Wrapper>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background color="#ede9e3" gap={24} />
        <Controls />
      </ReactFlow>
    </Wrapper>
  );
}
