// 고급웹프로그래밍(6084) 과제 #2 고건 60221300
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// 업로드할 파일 이름을 원본 파일 이름 + 시간 + 확장자로 저장
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router
  .route("/")
  .get((req, res) => {
    const userId = req.session.userId ? req.session.userId : null;
    res.render("photo", { user: userId, userId: userId, filenames: null });
  })
  // upload 폴더에 파일을 업로드하고 콘솔에 출력
  .post(upload.array("manyImages"), (req, res) => {
    const userId = req.session.userId ? req.session.userId : null;
    console.log(req.files, req.body);
    const filenames = req.files.reduce((filenames, file) => {
      filenames = filenames.concat(file.originalname, " ");
      return filenames;
    }, "");
    res.render("photo", { user: userId, userId: userId, filenames: filenames });
  });

export default router;
