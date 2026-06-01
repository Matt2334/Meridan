"use client";
import styled from "styled-components";
import { fadeUp } from "../../components/keys";
import { useState, useEffect } from "react";
import Card from "../../components/Card.js";
import Pagination from "../../components/Pagination.js";

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

export default function Bookmark() {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(()=>{
    const fetchBookmarks = async()=>{
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks?offset=${(page - 1) * 5}`, {method:"GET", credentials:"include", headers: {
            "Content-Type": "application/json",
          },});
        const data = await res.json();
        console.log(data.bookmarks)
        setBookmarks(data.bookmarks);
        setTotalPages(Math.ceil(data.total / 5));
      }catch(err){
        console.error(err);
      }
    }
    fetchBookmarks();
  },[page])
  return (
    <Wrapper>
      <Title>Bookmark history</Title>
      {!bookmarks || bookmarks.length === 0 ? (
        <Content>
          <EmptyTitle>Save Content today!</EmptyTitle>
          <EmptyParagraph>Bookmark articles to view them here</EmptyParagraph>
        </Content>
      ) : (
        <>
          {bookmarks.map((bookmark, i) => (
            <Card index={i + 1} key={bookmark.id} content={bookmark.content} />
          ))}
          <Pagination page={page} totalPages={totalPages} setChangePage={setPage} />
        </>
      )}
      
    </Wrapper>
  );
}
