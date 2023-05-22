// 고급웹프로그래밍(6084) 과제 #2 고건 60221300
import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// 기사 생성, 수정, 삭제 등의 작업을 수행할 매개 역할을 하는 객체 배열
let article = [];

router
  .route("/")
  // articles.json에 있는 데이터를 읽어서 req.article에 넘겨줌
  .get(async (req, res) => {
    const userId = req.session.userId ? req.session.userId : null;
    req.article = JSON.parse(
      await fs.readFile(path.join(__dirname, "../articles.json"))
    );
    article = req.article;
    res.render("article", { user: userId, userId: userId, articles: article });
  })
  // 새로운 기사 내용을 받아와서 article 배열에 추가 후 json파일에 저장
  .post(async (req, res) => {
    const new_content = req.body.content;
    const id = article.length;
    article.push({ id: id + 1, content: new_content });
    await fs.writeFile(
      path.join(__dirname, "../articles.json"),
      JSON.stringify(article)
    );
    res.redirect("/articles");
  })
  // 수정할 기사의 id값, 내용을 받아와서 article 배열에 수정 후 json파일에 저장
  .put(async (req, res) => {
    const { id, title } = req.body;
    article[id - 1] = { id, content: title };
    await fs.writeFile(
      path.join(__dirname, "../articles.json"),
      JSON.stringify(article)
    );
    res.end();
  })
  // 삭제할 기사의 id값을 받아와서 article 배열에서 삭제 후 json파일에 저장
  .delete(async (req, res) => {
    const id = req.body.id;
    delete article[id - 1];
    await fs.writeFile(
      path.join(__dirname, "../articles.json"),
      JSON.stringify(article)
    );
    res.end();
  });

export default router;
