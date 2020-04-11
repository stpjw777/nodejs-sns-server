exports.isLoggedIn = (req, res, next) => {
  if (req.isAutenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAutenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
