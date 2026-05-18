const { Prisma } = require('../../prisma/library/prisma');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// router.post('/signout', signOut);
const signOut = async (req, res) => {
  const userId = req?.user.id;
  try {
    // await Prisma.sessions.deleteMany({ where: { userId } });
    res.clearCookie("token");
    res.json({ message: "Signed out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// router.post('/signup', signUp);
const signUp = async (req, res) => {
  const { email, password, preferences } = req.body;
  // should we store name and reading speed?
  try {
    const p = await bcrypt.hash(password, 10);
    const user = await Prisma.user.create({
      data: { email: email, password: p, preferences: preferences },
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
// router.get('/signIn', signIn);
const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Prisma.user.findFirst({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const pMatch = await bcrypt.compare(password, user.password);
    if (!pMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    res.json({ message: "Sign in successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// router.delete('/delete', deleteUser);
const deleteUser = async (req, res) => {
  const userId = req?.user.id;
  try {
    const user = await Prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    await Prisma.sessions.deleteMany({ where: { userId } });
    await Prisma.user.delete({ where: { id: userId } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// router.get('/me', userInfo);
const userInfo = async (req,res)=>{
    const userId = req.user.id;
    try{
        const user = await Prisma.user.findUnique({where: {id: userId}});
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json(user);

    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });

    }

}

// router.put('/update', updateUser);
const updateUser = async (req, res) => {
  const { name, email, preferences } = req.body;
  const userId = req?.user.id;
  try {
    const user = await Prisma.user.update({
      where: { id: userId },
      data: { name, email, preferences },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
  const loggedIn = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Prisma.user.findFirst({
        where: { id: decoded.userId },
      });
      res.json({ authenticated: true });
    } catch (err) {
      res.json({ authenticated: false, error: err.message });
    }
  };

module.exports = {
  signOut,
  signIn,
  signUp,
  deleteUser,
  userInfo,
  updateUser,
  loggedIn,
};
