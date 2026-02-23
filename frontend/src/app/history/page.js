import styled, { keyframes } from "styled-components";
const fadeUp = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }`;

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 32px;
  animation: ${fadeUp} 0.5s ease 0s 1 normal forwards;
`;
const Title = styled.h2`
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 300;
  color: #1c1c1e;
  margin-bottom: 8px;
`;
const EmptyTitle = styled.h3`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.6rem;
  font-weight: 300;
  color: #6b6b6f;
  margin-bottom: 10px;
`;
const EmptyParagraph = styled.p`
  font-size: 0.88rem;
  color: #6b6b6f;
  font-weight: 300;
`;
const Content = styled.div`
  text-align: center;
  padding: 80px 0;
`;
const sessions = [];
export default function History() {
  return (
    <Wrapper>
      <Title>Your sessions</Title>
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        <p>Display sessions here</p>
      )}
      {sessions.length === 0 ? (
        <Content>
          <EmptyTitle>Your history is empty</EmptyTitle>
          <EmptyParagraph>complete your first session to see it here</EmptyParagraph>
        </Content>
      ) : (
        <Content>content</Content>
      )}
    </Wrapper>
  );
}
