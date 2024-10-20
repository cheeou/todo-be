const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      throw new Error("이미 존재하는 계정입니다.");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    console.log("hash", hash);
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "fail", err });
    console.log(err);
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      throw new Error("이메일과 비밀번호를 모두 입력해주세요.");
    }

    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
    console.log("Found user:", user ? user._id : "No user found");

    if (user) {
      console.log("Stored hashed password:", user.password);
      console.log("Provided password:", password);

      if (!user.password) {
        throw new Error("사용자 비밀번호가 설정되어 있지 않습니다.");
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      console.log("Password match:", isMatch);

      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (err) {
    console.log("loginWithEmail error:", err);
    res.status(400).json({ status: "fail", error: err.message });
  }
};
module.exports = userController;
