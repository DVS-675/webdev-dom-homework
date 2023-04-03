import {
  buttonElement,
  deleteButtonElement,
  listElement,
  nameInputElement,
  textInputElement,
  mainForm,
  comments,
} from "./script.js";

// Изменение лайков

export const changeLikesListener = () => {
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

export const validateInput = () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    buttonElement.disabled = true;
  } else {
    buttonElement.disabled = false;
  }
};
export const buttonBlock = () => {
  validateInput();
  document.querySelectorAll("#name-input,#text-input").forEach((el) => {
    el.addEventListener("input", () => {
      validateInput();
    });
  });
};

// ввод по кнопке enter

export const addCommentWithEnter = () => {
  mainForm.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
      buttonElement.click();
      nameInputElement.value = "";
      textInputElement.value = "";
    }
  });
  
};

// ответ на комментарии

export const editComment = () => {
  const comments = document.querySelectorAll(".comment");
  const textInputElement = document.getElementById("text-input");
  for (const comment of comments) {
    comment.addEventListener("click", () => {
      const textComment = comment.dataset.text;
      textInputElement.value = textComment;
    });
  }
};

//удаление последнего комментария

export const deleteComment = () => {
  deleteButtonElement.addEventListener("click", () => {
    comments.pop();
    renderComments();
  });
};

//рендер-функция

export const renderComments = () => {
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
  editComment();
};
