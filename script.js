import { getComments, publicComment } from "./api.js";
import { renderLoginComponent } from "./components/login-component.js";

let comments = [];
let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
token = null;

//get запрос

export const fetchGetAndRender = () => {
  const waitCommentMessage = document.getElementById("waitComment");
  waitCommentMessage.style.display = "inline";
  return getComments()
    .then((responseData) => {
      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
      };

      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
          date: new Date(comment.date).toLocaleString("ru-RU", options),
          text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
          likes: comment.likes,
          isLiked: false,
          id: comment.id,
        };
      });
      waitCommentMessage.style.display = "none";
      comments = appComments;

      console.log(comments[comments.length - 1].id);
      renderComments();
    })
    .catch((error) => {
      waitCommentMessage.style.display = "none";
      if (error === "Сервер упал") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
      console.warn(error);
    });
};

//рендер-функция

export const renderComments = () => {
  const appEl = document.getElementById("app");

  if (!token) {
    renderLoginComponent({
      comments,
      appEl,
      setToken: (newToken) => {
        token = newToken;
      },
      renderComments,
    });
    return;
  }

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

  const appHtml = `
            <div class="container">
              <p id = 'waitComment' style="display: none">Комментарии загружаются...</p>
              <ul id="list" class="comments">
                ${commentsHtml}
              </ul>
              <p id = 'addingComment' style="display: none">Комментарий добавляется...</p>
              <div class="add-form">
              
              <input
                
                type="text"
                id="name-input"
                class="add-form-name"
                placeholder="Введите ваше имя"
                
              />
              <textarea
                type="textarea"
                id="text-input"
                class="add-form-text"
                placeholder="Введите ваш комментарий"
                rows="4"
              ></textarea>
              <div class="add-form-row">
                <button id="add-button" class="add-form-button">Написать</button>
                <button data-id = 'id' id="delete-button" class="add-form-button">
                  Удалить комментарий
                </button>
              </div>
            </div>
          </div>`;

  appEl.innerHTML = appHtml;

  const buttonElement = document.getElementById("add-button");
  const deleteButtonElement = document.getElementById("delete-button");
  const listElement = document.getElementById("list");
  const nameInputElement = document.getElementById("name-input");
  const textInputElement = document.getElementById("text-input");
  const mainForm = document.querySelector(".add-form");
  const addCommentText = document.getElementById("addingComment");

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

    publicComment({
      name: nameInputElement.value,
      text: textInputElement.value,
      date: new Date(),
      forceError: true,
      token,
      
    })
      .then(() => {
        return fetchGetAndRender();
      })
      .then(() => {
        addCommentText.style.display = "none";
        mainForm.style.display = "flex";
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";
        nameInputElement.value = "";
        textInputElement.value = "";
      })
      .catch((error) => {
        addCommentText.style.display = "none";
        mainForm.style.display = "flex";
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";
        if (error === "Короткий текст") {
          alert("Имя и комментарий должны быть не короче 3 символов");
        } else if (error === "Сервер упал") {
          alert("Сервер сломался, попробуй позже");
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
        console.warn(error);
      });

    renderComments();
  });

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

  function deleteComment(token) {
    console.log(token);
    console.log(comments[comments.length - 1].id);
    return fetch(
      "https://webdev-hw-api.vercel.app/api/v2/dmitrii-vasin/comments/" +
        comments[comments.length - 1].id,
      {
        method: "DELETE",

        headers: {
          authorization: token,
        },
      }
    ).then((response) => {
      comments.pop();
      renderComments();
      return response.json();
    });
  }

  deleteButtonElement.addEventListener("click", () => {
    deleteComment(token);
  });

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

  changeLikesListener();

  editComment();
  buttonBlock();
};

renderComments();
fetchGetAndRender();

console.log("It works!");
