"use client";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
`;
const Arrow = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50px;
  border: 0.5px solid rgba(28, 28, 30, 0.1);
  background: #faf9f7;
  color: #6b6b6f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: ${({ $disabled }) => ($disabled ? "0.25" : "1")};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  &:hover {
    border-color: rgba(28, 28, 30, 0.25);
    color: #1c1c1e;
  }
`;
const Number = styled.span`
  font-size: 13px;
  color: #6b6b6f;
  font-weight: 300;
  min-width: 60px;
  text-align: center;
  strong {
    font-weight: 500;
    color: #1c1c1e;
  }
`;
export default function Pagination({ page, totalPages, setChangePage }) {
  return (
    <Wrapper>
      <Arrow $disabled={page === 1} onClick={() => setChangePage(page - 1)}>
        ‹
      </Arrow>
      <Number>
        <strong>{page}</strong> of {totalPages}
      </Number>
      <Arrow
        $disabled={page === totalPages}
        onClick={() => setChangePage(page + 1)}
      >
        ›
      </Arrow>
    </Wrapper>
  );
}
