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
const ToggleButton = styled.button``;


export default function History() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('list');
  const [connections, setConnections] = useState([]);
  useEffect(()=>{
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
  },[page])
  useEffect(()=>{
    const fetchConnections = async()=>{
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/connections`, {
          method:"GET",
          credentials: "include",
          headers:{ "Content-Type": "application/json",}
        })
        const data = await res.json();
        console.log(data)
        setConnections(data.connections)

      }catch(err){console.error(err)}
    }
    fetchConnections();
  },[])
  return (
    <Wrapper>
      <HistoryTitle>Session history</HistoryTitle>
      {!sessions || sessions.length === 0 ? (
        <Content>
          <EmptyTitle>Your history is empty</EmptyTitle>
          <EmptyParagraph>complete your first session to see it here</EmptyParagraph>
        </Content>
      ) : (
        <>
        <ToggleButton onClick={()=>setView(view === 'list' ? 'grid' : 'list')}>{view === 'list' ? 'Grid view' : 'List view'}</ToggleButton>
        {view==='list' ? (
          <>
            {sessions.map((session, i)=>(
              <HistoryCard key={session.id} session={session} />
            ))}
            <Pagination page={page} totalPages={totalPages} setChangePage={setPage} />
          </>
        ) : (
          connections.length===0 ? (
            <h1>No connections available</h1>
          ) : (
            <KnowledgeGraph sessions={sessions} connections={connections} />
          )
        )}
        
        </>
      )}
      
    </Wrapper>
  );
}
