"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
const Wrapper = styled.div`
  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
  z-index: 100;
  padding: 20px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(245, 243, 239, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);

`;
const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;
const NavLogo = styled.a`
  font-family: "Cormorant Garamond", serif;
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #1c1c1e;
  cursor: pointer;
text-decoration: none;
`;
const NavLink = styled.a`
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b6b6f;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  text-decoration: none;

  &:hover, &:active {
    color: #1c1c1e;
    border-color: #1c1c1e;
  }
  
`;

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false); 
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/loggedIn`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.authenticated) {
                setIsSignedIn(true);
            } else {
                setIsSignedIn(false);
            }
        } catch (err) {
            setIsSignedIn(false);
        }
    };

    checkAuth();
}, []);
  const handleSignOut = async () => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setIsSignedIn(false);
      }
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }
  return (
    <Wrapper>
      <div>
        <NavLogo href="/">Meridan</NavLogo>
      </div>

      <NavLinks>
        <NavLink href="/">Learn</NavLink>
        <NavLink href="/history">History</NavLink>
        {isSignedIn? <NavLink onClick={handleSignOut}>Sign Out</NavLink> : <>
        <NavLink href="/signin">Sign In</NavLink>
        <NavLink href="/signup">Sign Up</NavLink>
        </>}
      </NavLinks>
    </Wrapper>
  );
}
