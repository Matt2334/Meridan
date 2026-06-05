"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { IconLogout, IconSettings, IconUser, IconBookmark } from "@tabler/icons-react";
import {useRouter} from "next/navigation";
const Wrapper = styled.div`
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

  &:hover,
  &:active {
    color: #1c1c1e;
    border-color: #1c1c1e;
  }
`;
const B = styled.button`
  background: none;
  border: none;
  color: #6b6b6f;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 400;
  padding: 6px 0;
  font-family:
    DM Sans,
    sans-serif;
`;
const DropMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #faf9f7;
  border: 0.5px solid rgba(28, 28, 30, 0.1);
  border-radius: 16px;
  padding: 12px 0;
  min-width: 180px;
  box-shadow: 0 4px 32px rgba(28, 28, 30, 0.08);
  display: flex;
  flex-direction: column;
`;

const DropItem = styled.a`
  padding: 12px 20px;
  font-size: 13px;
  color: #1c1c1e;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(28, 28, 30, 0.05);
  }
`;

const DropButton = styled.button`
  padding: 12px 20px;
  font-size: 13px;
  background: none;
  border: none;
  color: #e24b4a;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: background 0.2s;

  &:hover {
    background: rgba(226, 75, 74, 0.05);
  }
`;
export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/loggedIn`,
          {
            method: "GET",
            credentials: "include",
          },
        );
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
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) setIsSignedIn(false);
      router.push("/signin");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen]);
  return (
    <Wrapper>
      <div>
        <NavLogo href="/">Meridan</NavLogo>
      </div>

      <NavLinks>
        <NavLink href="/">Learn</NavLink>
        <NavLink href="/history">History</NavLink>
        {isSignedIn ? (
          <div style={{ position: "relative" }}>
            <B onClick={() => setUserMenuOpen(!userMenuOpen)}>User Info</B>
            {userMenuOpen && (
              <DropMenu>
                <DropItem href="/bookmarks">
                  <IconBookmark size={16} /> Bookmarks
                </DropItem>
                <DropItem href="/profile">
                  <IconUser size={16} /> Edit Profile
                </DropItem>
                <DropItem href="/settings">
                  <IconSettings size={16} /> Settings
                </DropItem>
                <DropButton onClick={handleSignOut}>
                  <IconLogout size={16} /> Sign out
                </DropButton>
              </DropMenu>
            )}
          </div>
        ) : (
          <>
            <NavLink href="/signin">Sign In</NavLink>
            <NavLink href="/signup">Sign Up</NavLink>
          </>
        )}
      </NavLinks>
    </Wrapper>
  );
}
