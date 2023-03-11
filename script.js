const buttonElement = document.getElementById("add-button");
const deleteButtonElement = document.getElementById("delete-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const mainForm = document.querySelector(".add-form");

/* const changeLikesQuantity = () => {
  const buttonLikeElements = document.querySelectorAll(".like-button");
  const likesQuantity = document.querySelectorAll(".likes-counter");
  let like = true;

  for (const buttonLikeElement of buttonLikeElements) {
    buttonLikeElement.addEventListener("click", () => {
      likesQuantity = like ? ++likesQuantity : --likesQuantity;
      like = !like;
      document.querySelectorAll(".likes-counter").innerHTML = likesQuantity;
    });
  }
}; */

// Изменение лайков

const changeLikesListener = () => {
  const buttonLikeElements = document.querySelectorAll(".like-button");

  for (const buttonLikeElement of buttonLikeElements) {
    buttonLikeElement.addEventListener("click", () => {
      const index = buttonLikeElement.dataset.index;

      if (comments[index].liked === false) {
        comments[index].liked = true;
        comments[index].likes += 1;
      } else if (comments[index].liked === true) {
        comments[index].liked = false;
        comments[index].likes -= 1;
      }
      renderComments();
    });
  }
};

//Добавление комментария

buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  textInputElement.classList.remove("error");

  if (nameInputElement.value === "" || textInputElement.value === "") {
    nameInputElement.classList.add("error");
    textInputElement.classList.add("error");
    return;
  }
  const options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  };
  const date = new Date().toLocaleString("ru-RU", options);

  comments.push({
    name: nameInputElement.value,
    date: date,
    text: textInputElement.value,
    likes: 0,
    liked: false,
  });

  renderComments();

  nameInputElement.value = "";
  textInputElement.value = "";
});

// блокировка кнопки

/*    const buttonBlock = () => {
      document.querySelectorAll("#name-input,#text-input").forEach((el) => {
        el.addEventListener("input", () => {
          if (nameInputElement.value === "" || textInputElement.value === "") {
            buttonElement.disabled = true;
          } else {
            buttonElement.disabled = false;
          }
        });
      });
    }; */

// ввод по кнопке enter

mainForm.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    buttonElement.click();
    nameInputElement.value = "";
    textInputElement.value = "";
  }
});

//удаление последнего комментария

const deleteComment = () => {
  const deleteButtonElement = document.getElementById("delete-button");
  const listElement = document.getElementById("list");

  deleteButtonElement.addEventListener("click", () => {
    const element = listElement.lastChild;
    element.remove();
  });
};

//DOM 2

const comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22 12:18",
    text: "Это будет первый комментарий на этой странице",
    likes: 3,
    liked: false,
  },
  {
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    text: "Мне нравится как оформлена эта страница! ❤",
    likes: 75,
    liked: true,
  },
];

//рендер-функция

const renderComments = () => {
  const commentsHtml = comments
    .map((student, index) => {
      return `<li id = "list-comment" class="comment">
          <div class="comment-header">
            <div>${student.name}</div>
            <div>${student.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${student.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${student.likes}</span>
              <button data-index = '${index}' class="${
        student.liked ? "like-button -active-like" : "like-button"
      }"></button>
            </div>
          </div>
        </li>`;
    })
    .join("");
  listElement.innerHTML = commentsHtml;

  changeLikesListener();
};

renderComments();

console.log("It works!");