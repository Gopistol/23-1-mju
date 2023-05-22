// 고급웹프로그래밍(6084) 과제 #2 고건 60221300
let type; // 수정, 삭제 타입 지정
async function editArticle() {
  type = "edit";
}
async function deleteArticle() {
  type = "delete";
}
async function edit_article(article_number) {
  const id = article_number;
  const title = prompt("바꿀 기사 내용을 입력하세요");
  if (!title) {
    return alert("내용을 반드시 입력하셔야 합니다");
  }
  try {
    await axios.put("/articles", { id, title });
  } catch (err) {
    console.error(err);
  }
}
async function delete_article(article_number) {
  const id = article_number;
  try {
    await axios.delete("/articles", { data: { id } });
  } catch (err) {
    console.error(err);
  }
}

// 수정, 삭제할 기사 번호 가져와서 type에 따라 서버로 전송해주는 함수 호출
document
  .getElementById("article_number_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const article_number = e.target.article_number.value;
    if (!article_number) {
      if (type === "edit") {
        return alert("수정할 기사 번호를 입력해주세요.");
      } else if (type === "delete") {
        return alert("삭제할 기사 번호를 입력해주세요.");
      }
    }
    try {
      switch (type) {
        case "edit":
          await edit_article(article_number);
          location.href = "/articles";
          break;
        case "delete":
          await delete_article(article_number);
          location.href = "/articles";
          break;
      }
    } catch (err) {
      console.error(err);
    }
    e.target.article_number.value = "";
  });

// 새로 작성한 기사가 공백이 아니면 post 요청 보냄
document
  .getElementById("input_content_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = e.target.content.value.trim(); // 작성한 기사 내용의 맨 앞,뒤 공백을 제거하여 빈 기사 등록 방지
    e.target.content.value = "";
    if (!content) {
      return alert("기사 내용을 입력해주세요.");
    }
    try {
      // /articles 로 기사를 보냄
      await axios.post("/articles", { content });
      location.href = "/articles";
    } catch (err) {
      console.error(err);
    }
  });

// 파일을 선택했는지 검사
function isFileSelected() {
  const name = document.getElementById("fileName");
  if (!name.textContent) {
    return alert("사진 파일을 선택해주세요.");
  }
}

// photo.ejs 에서 업로드할 fileName을 보여주는 함수
function loadFileName(input) {
  const fileName = input.files[0].name;
  const fileLength = input.files.length;
  const name = document.getElementById("fileName");
  let text = "";
  if (fileLength == 1) {
    // 업로드할 파일이 1개면 파일 이름만 표시
    text = ` ${fileName}`;
  } else {
    // 2개 이상이면 파일 이름 + 나머지 파일 개수도 표시
    text = ` ${fileName} 외 ${fileLength - 1}개`;
  }
  name.textContent = text;
}
