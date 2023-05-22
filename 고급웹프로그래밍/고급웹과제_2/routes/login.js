// 고급웹프로그래밍(6084) 과제 #2 고건 60221300
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const user = req.session.userId ? req.session.userId : null;
  res.render("login", { user, userId: user });
});

router
  .route("/login")
  // 세션쿠키가 있으면 userId를 받아오고 없으면 null로 대체
  .get((req, res) => {
    const userId = req.session.userId ? req.session.userId : null;
    res.render("login", { user: userId, userId: userId });
  })
  // 사용자 아이디를 받아와서 세션에 저장
  .post((req, res) => {
    const userId = req.body.id;
    if (userId) {
      req.session.userId = userId;
    }
    res.render("login", { user: userId, userId: userId });
  });

export default router;
