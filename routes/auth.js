const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIN } = require("./middlewares");
const { User } = require("../models");

const router = express.Router();

router.post("/join", isNotLoggedIN, async (req, res, next) => {
  const { email, nick, password } = req.body; //req.body.를 생략할수 있게 위의 범위에서 { }

  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      req.flash("join", "이미 가입된 이메일입니다."); //한번만 띄워주는거 팝업 비슷
      return res.redirect("/join");
    }
    const hash = await bcrypt.hash(password, 12); // bcrypt 비번 암호화 12번
    await User.create({
      email, //email :this.email을 생략해준거
      nick, //this.nick을 생략
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIN, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash("loginError", info.message);
      return res.redirect("/");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginerror);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
