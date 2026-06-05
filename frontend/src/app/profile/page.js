"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Wrapper = styled.div`
  max-width: 580px;
  margin: 0 auto;
  padding-top: 40px;
`;
const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4a6fa5;
  margin-bottom: 12px;
`;
const PageTitle = styled.h1`
  font-family: "Cormorant Garamond", serif;
  font-size: 2.2rem;
  font-weight: 300;
  color: #1c1c1e;
  margin-bottom: 6px;
  em {
    font-style: italic;
  }
`;
const PageSub = styled.p`
  font-size: 0.88rem;
  color: #6b6b6f;
  font-weight: 300;
  margin-bottom: 2.5rem;
`;
const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #faf9f7;
  border: 0.5px solid rgba(28, 28, 30, 0.1);
  border-radius: 16px;
  margin-bottom: 2.5rem;
`;
const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #eef3fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cormorant Garamond", serif;
  font-size: 18px;
  font-weight: 500;
  color: #4a6fa5;
  flex-shrink: 0;
`;
const AvatarInfo = styled.div`
  flex: 1;
`;
const AvatarName = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #1c1c1e;
  margin-bottom: 2px;
`;
const AvatarEmail = styled.p`
  font-size: 0.82rem;
  color: #6b6b6f;
  font-weight: 300;
`;
const AvatarSince = styled.p`
  font-size: 0.75rem;
  color: #6b6b6f;
  font-weight: 300;
  margin-top: 2px;
`;
const RoleBadge = styled.span`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 50px;
  background: #eef3fa;
  color: #4a6fa5;
  margin-left: 8px;
`;
const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b6b6f;
  margin-bottom: 1.25rem;
`;
const Field = styled.div`
  margin-bottom: 1.25rem;
`;
const FieldLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b6b6f;
  margin-bottom: 8px;
`;
const FieldInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 50px;
  border: 0.5px solid rgba(28, 28, 30, 0.15);
  background: #faf9f7;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  color: #1c1c1e;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus {
    border-color: rgba(28, 28, 30, 0.4);
  }
`;
const FieldHint = styled.p`
  font-size: 11px;
  color: #6b6b6f;
  font-weight: 300;
  margin-top: 6px;
  padding-left: 16px;
`;
const BtnRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2rem;
`;
const BtnPrimary = styled.button`
  padding: 12px 32px;
  border-radius: 50px;
  background: #1c1c1e;
  color: #f5f3ef;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
const BtnGhost = styled.button`
  padding: 12px 24px;
  border-radius: 50px;
  background: transparent;
  border: 0.5px solid rgba(28, 28, 30, 0.15);
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #6b6b6f;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: rgba(28, 28, 30, 0.3);
    color: #1c1c1e;
  }
`;
const SuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #eef3fa;
  border-radius: 10px;
  font-size: 13px;
  color: #4a6fa5;
  margin-bottom: 1.5rem;
`;
const Divider = styled.div`
  height: 0.5px;
  background: rgba(28, 28, 30, 0.08);
  margin: 2rem 0;
`;
const DangerZone = styled.div`
  padding: 20px;
  background: #faf9f7;
  border: 0.5px solid rgba(226, 75, 74, 0.2);
  border-radius: 16px;
  margin-top: 1rem;
`;
const DangerTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #1c1c1e;
  margin-bottom: 6px;
`;
const DangerSub = styled.p`
  font-size: 12px;
  color: #6b6b6f;
  font-weight: 300;
  margin-bottom: 14px;
  line-height: 1.5;
`;
const BtnDanger = styled.button`
  padding: 10px 24px;
  border-radius: 50px;
  background: transparent;
  border: 0.5px solid rgba(226, 75, 74, 0.4);
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #e24b4a;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(226, 75, 74, 0.05);
    border-color: #e24b4a;
  }
`;

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        console.log(data);
        // setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        },
      );
      if (res.ok) setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      router.push("/signup");
    } catch (err) {
      console.error(err);
    }
  };
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email?.slice(0, 2).toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Wrapper>
      <Eyebrow>Account</Eyebrow>
      <PageTitle>Edit <em>profile</em></PageTitle>
      <PageSub>Update your name and email address</PageSub>

      <AvatarRow>
        <Avatar>{initials}</Avatar>
        <AvatarInfo>
          <AvatarName>
            {name || 'Anonymous'}
            <RoleBadge>{user?.role?.toLowerCase()}</RoleBadge>
          </AvatarName>
          <AvatarEmail>{email}</AvatarEmail>
          {memberSince && <AvatarSince>Member since {memberSince}</AvatarSince>}
        </AvatarInfo>
      </AvatarRow>

      {success && <SuccessBanner>✦ Profile updated successfully</SuccessBanner>}

      <SectionLabel>Personal info</SectionLabel>

      <Field>
        <FieldLabel>Full name</FieldLabel>
        <FieldInput
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
        />
      </Field>

      <Field>
        <FieldLabel>Email address</FieldLabel>
        <FieldInput
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        <FieldHint>Changing your email will require you to sign in again</FieldHint>
      </Field>

      <BtnRow>
        <BtnPrimary onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes →'}
        </BtnPrimary>
        <BtnGhost onClick={() => router.back()}>Cancel</BtnGhost>
      </BtnRow>

      <Divider />

      <SectionLabel>Danger zone</SectionLabel>
      <DangerZone>
        <DangerTitle>Delete account</DangerTitle>
        <DangerSub>
          Permanently delete your account and all associated sessions, bookmarks, and history. This action cannot be undone.
        </DangerSub>
        <BtnDanger onClick={handleDelete}>Delete account</BtnDanger>
      </DangerZone>
    </Wrapper>
  );
}
