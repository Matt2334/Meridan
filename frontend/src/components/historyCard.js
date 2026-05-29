"use client";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #faf9f7;
  border: 0.5px solid rgba(28, 28, 30, 0.1);
  border-radius: 16px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  transition: border-color 0.2s;
  cursor: pointer;
  &:hover {
    border-color: rgba(28, 28, 30, 0.25);
  }
`;
const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
`;
const DayBlock = styled.span`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.6rem;
  font-weight: 300;
  color: #1c1c1e;
  line-height: 1;
`;
const MonthBlock = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b6b6f;
  margin-top: 2px;
`;
const Divider = styled.div`
  width: 0.5px;
  height: 40px;
  background: rgba(28, 28, 30, 0.1);
  flex-shrink: 0;
`;
const Info = styled.div`
  flex: 1;
  min-width: 0;
`;
const Title = styled.p`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.05rem;
  font-weight: 400;
  color: #1c1c1e;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;
const Tag = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #4a6fa5;
  background: #dee7f5;
  padding: 3px 10px;
  border-radius: 50px;
`;
const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(28, 28, 30, 0.2);
`;
const Sub = styled.span`
  font-size: 12px;
  color: #6b6b6f;
  font-weight: 300;
`;
const Status = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 50px;
  flex-shrink: 0;
  background: ${({ $complete }) =>
    $complete ? "#eef3fa" : "rgba(28,28,30,0.05)"};
  color: ${({ $complete }) => ($complete ? "#4a6fa5" : "#6b6b6f")};
`;
export default function HistoryCard({ session }) {
  const date = new Date(session.createdAt);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const isComplete = !!session.completedAt;
  const itemCount = session.sessionItems?.length || 0;
  const topic =
    itemCount > 0 ? session.sessionItems[0].content?.topic : "Learning Session";
  return (
    <Wrapper>
      <DateBlock>
        <DayBlock>{day}</DayBlock>
        <MonthBlock>{month}</MonthBlock>
      </DateBlock>
      <Divider />
      <Info>
        <Title>{topic}</Title>
        <Meta>
          <Tag>{topic}</Tag>
          <Dot />
          <Sub>{session.timeAvailable} min session</Sub>
          {itemCount > 0 && (
            <>
              <Dot />
              <Sub>
                {itemCount} article{itemCount !== 1 ? "s" : ""}
              </Sub>
            </>
          )}
        </Meta>
      </Info>
      <Status $complete={isComplete}>
        {isComplete ? "Complete" : "Partial"}
      </Status>
    </Wrapper>
  );
}
