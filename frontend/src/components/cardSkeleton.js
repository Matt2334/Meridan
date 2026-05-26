"use client";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -600px 0 }
  100% { background-position: 600px 0 }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #ede9e3 25%, #e5e1da 50%, #ede9e3 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
  border-radius: 8px;
`;

const SkeletonCard = styled.div`
  background: #faf9f7;
  border: 1px solid rgba(28,28,30,0.1);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 16px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 18px;
  width: 65%;
  margin-bottom: 12px;
`;

const SkeletonDesc = styled(SkeletonBase)`
  height: 13px;
  width: 100%;
  margin-bottom: 8px;
`;

const SkeletonDescShort = styled(SkeletonBase)`
  height: 13px;
  width: 80%;
  margin-bottom: 16px;
`;

const SkeletonMeta = styled(SkeletonBase)`
  height: 13px;
  width: 20%;
`;

export default function CardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonTitle />
      <SkeletonDesc />
      <SkeletonDescShort />
      <SkeletonMeta />
    </SkeletonCard>
  );
}