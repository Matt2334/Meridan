"use client";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Wrapper = styled.div``;

const Divider = styled.div`
  height: 0.5px;
  background: rgba(28, 28, 30, 0.1);
  margin: 48px 0;
`;
const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b6b6f;
  margin-bottom: 24px;
`;
const SectionTitle = styled.h2`
  font-family: "Cormorant Garamond", serif;
  font-size: 2rem;
  font-weight: 300;
  color: #1c1c1e;
  margin-bottom: 28px;
  line-height: 1.2;
  em {
    font-style: italic;
  }
`;
const TakeawayList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 48px;
`;
const TakeawayItem = styled.li`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 0.5px solid rgba(28, 28, 30, 0.1);
  &:first-child {
    border-top: 0.5px solid rgba(28, 28, 30, 0.1);
  }
`;
const TakeawayDash = styled.span`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.1rem;
  color: #6b6b6f;
  flex-shrink: 0;
`;
const TakeawayText = styled.span`
  font-size: 0.95rem;
  font-weight: 300;
  color: #3a3a3c;
  line-height: 1.65;
`;
const ConvoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 48px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const ConvoItem = styled.li`
  padding: 18px 20px;
  border-left: 2px solid #d4e0f0;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.08rem;
  font-weight: 300;
  font-style: italic;
  color: #3a3a3c;
  line-height: 1.55;
`;
const DoneBtn = styled.button`
  padding: 14px 36px;
  border-radius: 50px;
  background: #1c1c1e;
  color: #f5f3ef;
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;
export default function sessionComplete({sessionId }) {
  const [takeaways, setTakeaways] = useState(null);
  const [generatingTakeaways, setGeneratingTakeaways] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setGeneratingTakeaways(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/takeaways`,
        { method: "POST", credentials: "include" },
      );
      const data = await res.json();
      setTakeaways(data);
      console.log(data);

    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingTakeaways(false);
    }
  };
  return (
        <>
          <Divider />
          {generatingTakeaways && (
            <>
              <SectionLabel>Generating insights</SectionLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "32px 0",
                }}
              >
                {/* loading dots */}
                <span
                  style={{
                    fontSize: "0.88rem",
                    color: "#6b6b6f",
                    fontStyle: "italic",
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  Synthesizing your session...
                </span>
              </div>
            </>
          )}
          {!takeaways && !generatingTakeaways && (
            <DoneBtn onClick={handleComplete}>Generate insights →</DoneBtn>
          )}
          {takeaways && (
            <>
              <SectionLabel>Session complete</SectionLabel>
              <SectionTitle>
                Key <em>insights</em>
              </SectionTitle>
              <TakeawayList>
                {takeaways.takeaways.map((t, i) => (
                  <TakeawayItem key={i}>
                    <TakeawayDash>—</TakeawayDash>
                    <TakeawayText>{t}</TakeawayText>
                  </TakeawayItem>
                ))}
              </TakeawayList>

              <SectionTitle>
                Conversation <em>starters</em>
              </SectionTitle>
              <ConvoList>
                {takeaways.conversationStarters.map((c, i) => (
                  <ConvoItem key={i}>{c}</ConvoItem>
                ))}
              </ConvoList>

              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <DoneBtn onClick={() => router.push("/")}>Done →</DoneBtn>
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "#6b6b6f",
                    fontWeight: 300,
                  }}
                >
                  Session saved to your history
                </span>
              </div>
            </>
          )}
        </>
  );
}
