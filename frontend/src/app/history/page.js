"use client";
import styled from "styled-components";
import { fadeUp } from "../../components/keys";
import { useState, useEffect } from "react";
import HistoryCard from "../../components/historyCard.js";
import Pagination from "../../components/Pagination.js";
import KnowledgeGraph from "../../components/knowledgeGraph";

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 32px;
  animation: ${fadeUp} 0.5s ease 0s 1 normal forwards;
`;
const HistoryTitle = styled.h2`
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 300;
  color: #1c1c1e;
  margin: 0;
`;
const ToggleWrap = styled.div`
  display: flex;
  gap: 4px;
  background: var(--color-background-secondary);
  padding: 4px;
  border-radius: 50px;
  border: 0.5px solid rgba(28,28,30,0.1);
`;
const ToggleBtn = styled.button`
  padding: 7px 18px;
  border-radius: 50px;
  border: ${({ $active }) => $active ? '0.5px solid rgba(28,28,30,0.1)' : 'none'};
  background: ${({ $active }) => $active ? '#faf9f7' : 'transparent'};
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active }) => $active ? '#1c1c1e' : '#6b6b6f'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;
const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
`;
const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(28,28,30,0.04);
  border: 0.5px solid rgba(28,28,30,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;
const EmptyTitle = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #6b6b6f;
  margin-bottom: 8px;
`;
const EmptySub = styled.p`
  font-size: 0.85rem;
  color: #6b6b6f;
  font-weight: 300;
`;
const NoConnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  background: rgba(28,28,30,0.02);
  border-radius: 16px;
  border: 0.5px solid rgba(28,28,30,0.08);
`;

export default function History() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('list');
  const [connections, setConnections] = useState([]);
  const [graphSessions, setGraphSessions] = useState([])
  useEffect(()=>{
    if (view !== 'list') return;
    const fetchSessions = async()=>{
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions?offset=${(page - 1) * 5}`, {method:"GET", credentials:"include", headers: {
            "Content-Type": "application/json",
          },});
        const data = await res.json();
        setSessions(data.sessions);
        setTotalPages(Math.ceil(data.total / 5));
      }catch(err){
        console.error(err);
      }
    }
    fetchSessions();
  },[page,view])
  useEffect(()=>{
    if (view !== 'graph') return;
    const fetchConnections = async()=>{
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/connections`, {
          method:"GET",
          credentials: "include",
          headers:{ "Content-Type": "application/json",}
        })
        const data = await res.json();
        setConnections(data.connections)
        setGraphSessions(data.sessions)

      }catch(err){console.error(err)}
    }
    fetchConnections();
  },[view])
  return (
    <Wrapper>
  <HeaderRow>
    <HistoryTitle>Session history</HistoryTitle>
    <ToggleWrap>
      <ToggleBtn $active={view === 'list'} onClick={() => setView('list')}>
        <i className="ti ti-layout-list" aria-hidden="true"></i>
        List
      </ToggleBtn>
      <ToggleBtn $active={view === 'graph'} onClick={() => setView('graph')}>
        <i className="ti ti-chart-dots" aria-hidden="true"></i>
        Graph
      </ToggleBtn>
    </ToggleWrap>
  </HeaderRow>

  {!sessions || sessions.length === 0 ? (
    <EmptyWrap>
      <EmptyIcon>
        <i className="ti ti-history" style={{ fontSize: 20, color: '#6b6b6f' }} aria-hidden="true"></i>
      </EmptyIcon>
      <EmptyTitle>Your history is empty</EmptyTitle>
      <EmptySub>Complete your first session to see it here</EmptySub>
    </EmptyWrap>
  ) : (
    <>
      {view === 'list' ? (
        <>
          {sessions.map(session => (
            <HistoryCard key={session.id} session={session} />
          ))}
          <Pagination page={page} totalPages={totalPages} setChangePage={setPage} />
        </>
      ) : (
        connections.length === 0 ? (
          <NoConnWrap>
            <EmptyIcon>
              <i className="ti ti-chart-dots" style={{ fontSize: 20, color: '#6b6b6f' }} />
            </EmptyIcon>
            <EmptyTitle>No connections yet</EmptyTitle>
            <EmptySub>Complete more sessions to see how your learning connects across topics</EmptySub>
          </NoConnWrap>
        ) : (
          <KnowledgeGraph sessions={graphSessions} connections={connections} />
        )
      )}
    </>
  )}
</Wrapper>
  );
}
