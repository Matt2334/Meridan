import { Prisma } from "../../prisma/library/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
// router.post('/signout', signOut);
import {
  SignUpBodyRequest,
  SignInBody,
  UserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ErrorResponse,
} from "../types";
// Request<Params, ResBody, ReqBody, QueryParams>

interface MessageResponse {
  message: string;
}
const signOut = async (
  req: Request,
  res: Response<MessageResponse | ErrorResponse>,
) => {
  // const userId = req.user?.userId;
  try {
    res.clearCookie("token");
    res.json({ message: "Signed out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.post('/signup', signUp);
const signUp = async (
  req: Request<{}, {}, SignUpBodyRequest>,
  res: Response<MessageResponse | ErrorResponse>,
) => {
  const { email, password, name } = req.body;
  // should we store reading speed or preferences?
  try {
    const p = await bcrypt.hash(password, 10);
    const user = await Prisma.user.create({
      data: { email: email, name: name ? name : "John Doe", password: p },
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};
// router.get('/signIn', signIn);
const signIn = async (
  req: Request<{}, {}, SignInBody>,
  res: Response<MessageResponse | ErrorResponse>,
) => {
  const { email, password } = req.body;
  try {
    const user = await Prisma.user.findFirst({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const pMatch = await bcrypt.compare(password, user.password);
    if (!pMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    res.json({ message: "Sign in successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.delete('/delete', deleteUser);
const deleteUser = async (
  req: Request,
  res: Response<MessageResponse | ErrorResponse>,
) => {
  const userId = req.user?.userId;
  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    await Prisma.sessions.deleteMany({ where: { userId } });
    await Prisma.user.delete({ where: { id: userId } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// router.get('/me', userInfo);
const userInfo = async (
  req: Request,
  res: Response<UserResponse | ErrorResponse>,
) => {
  const userId = req.user?.userId;
  try {
    const user = await Prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// router.patch('/update', updateUser);
const updateUser = async (req:Request<{},{}, UpdateUserRequest>, res:Response<UpdateUserResponse|ErrorResponse>) => {
  // const {preferences } = req.body;
  const { email, name } = req.body;
  const userId = req.user?.userId;
  try {
    const user = await Prisma.user.update({
      where: { id: userId },
      data: { email, name },
      // data: {preferences },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

interface LoginResponse{
  authenticated:boolean;
  error?:string;
}
const loggedIn = async (req:Request, res:Response<LoginResponse>) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {userId:string;};
    const user = await Prisma.user.findFirst({
      where: { id: decoded.userId },
    });
    if(!user){
      res.status(403).json({authenticated:false});
      return;
    }
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false, error: (err as Error).message });
  }
};

export { signOut, signIn, signUp, deleteUser, userInfo, updateUser, loggedIn };
