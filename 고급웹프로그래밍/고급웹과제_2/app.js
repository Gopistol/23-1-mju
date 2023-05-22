// 고급웹프로그래밍(6084) 과제 #2 고건 60221300
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import loginRouter from "./routes/login.js";
import articleRouter from "./routes/article.js";
import uploadRouter from "./routes/upload.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

// 기본 설정
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 미들웨어 설정
app.get("/favicon.ico", (req, res) => res.status(204)); // favicon 요청 무시
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  // 세션 설정
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 0.5 * 60 * 60 * 1000, // 30분 이후 세션 만료
    },
  })
);

try {
  // 서버 실행 전 사진 업로드를 위한 uploads 폴더 설정
  fs.readdirSync("./uploads");
} catch (err) {
  console.error("uploads 폴더가 없어 새로 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

// 라우터 설정
app.use("/", loginRouter);
app.use("/articles", articleRouter);
app.use("/upload", uploadRouter);

// 404 페이지
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 처리 페이지
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send("error");
});

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 대기 중입니다`);
});
