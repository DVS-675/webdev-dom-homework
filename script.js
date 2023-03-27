const buttonElement = document.getElementById("add-button");
const deleteButtonElement = document.getElementById("delete-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const mainForm = document.querySelector(".add-form");
const addCommentText = document.getElementById("addingComment");
const waitCommentMessage = document.getElementById("waitComment");
//GET запрос с сервера
waitCommentMessage.style.display = "inline";
const fetchGetAndRender = () => {
  return fetch(
    "https://webdev-hw-api.vercel.app/api/v1/dmitrii-vasin/comments",
    {
      method: "GET",
    }
  )
    .then((response) => {
      console.log(response);

      return response.json();
    })

    .then((responseData) => {
      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
      };
      console.log(responseData);
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
          date: new Date(comment.date).toLocaleString("ru-RU", options),
          text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
          likes: comment.likes,
          isLiked: false,
        };
      });
      waitCommentMessage.style.display = "none";
      comments = appComments;
      renderComments();
    });
};

// Изменение лайков

const changeLikesListener = () => {
  const buttonLikeElements = document.querySelectorAll(".like-button");

  for (const buttonLikeElement of buttonLikeElements) {
    buttonLikeElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = buttonLikeElement.dataset.index;

      if (comments[index].isLiked === false) {
        comments[index].isLiked = true;
        comments[index].likes += 1;
      } else if (comments[index].isLiked === true) {
        comments[index].isLiked = false;
        comments[index].likes -= 1;
      }
      renderComments();
    });
  }
};

//Добавление комментария, POST запрос с GET

buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  textInputElement.classList.remove("error");

  if (nameInputElement.value === "" || textInputElement.value === "") {
    nameInputElement.classList.add("error");
    textInputElement.classList.add("error");
    return;
  }
  addCommentText.style.display = "inline";
  mainForm.style.display = "none";
  buttonElement.disabled = true;
  buttonElement.textContent = "Загружаю...";
  fetch("https://webdev-hw-api.vercel.app/api/v1/dmitrii-vasin/comments", {
    method: "POST",
    body: JSON.stringify({
      name: nameInputElement.value,
      text: textInputElement.value,
      date: new Date(),
    }),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })

    .then(() => {
      return fetchGetAndRender();
    })
    .then(() => {
      addCommentText.style.display = "none";
      mainForm.style.display = "flex";
      buttonElement.disabled = false;
      buttonElement.textContent = "Написать";
    });

  renderComments();

  nameInputElement.value = "";
  textInputElement.value = "";
});

// блокировка кнопки
const validateInput = () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    buttonElement.disabled = true;
  } else {
    buttonElement.disabled = false;
  }
};
const buttonBlock = () => {
  validateInput();
  document.querySelectorAll("#name-input,#text-input").forEach((el) => {
    el.addEventListener("input", () => {
      validateInput();
    });
  });
};

// ввод по кнопке enter

mainForm.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    buttonElement.click();
    nameInputElement.value = "";
    textInputElement.value = "";
  }
});

//удаление последнего комментария
/* const deleteComment = () => {
  deleteButtonElement.addEventListener("click", () => {
    const elem = document.getElementById("list").lastChild;
    elem.parentNode.removeChild(elem);
  });
}; */

// ответ на комментарии

const editComment = () => {
  const comments = document.querySelectorAll(".comment");
  const textInputElement = document.getElementById("text-input");
  for (const comment of comments) {
    comment.addEventListener("click", () => {
      const textComment = comment.dataset.text;
      textInputElement.value = textComment;
    });
  }
};

//DOM 2

let comments = [];

//рендер-функция

const renderComments = () => {
  const commentsHtml =
    comments &&
    comments
      .map((comment, index) => {
        return `<li data-text = '&gt ${comment.text} \n ${
          comment.name
        }' class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button data-index = '${index}' class="${
          comment.isLiked ? "like-button -active-like" : "like-button"
        }"></button>
            </div>
          </div>
        </li>`;
      })
      .join("");
  listElement.innerHTML = commentsHtml;

  changeLikesListener();
  /* deleteComment(); */
  editComment();
};
fetchGetAndRender();
renderComments();
buttonBlock();
console.log("It works!");
