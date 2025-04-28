document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".see-more").forEach((button) => {
    button.addEventListener("click", function () {
      let shortComment = this.previousElementSibling.previousElementSibling;
      let fullComment = this.previousElementSibling;

      if (fullComment.classList.contains("d-none")) {
        shortComment.classList.add("d-none");
        fullComment.classList.remove("d-none");
        this.textContent = "See Less";
      } else {
        shortComment.classList.remove("d-none");
        fullComment.classList.add("d-none");
        this.textContent = "See More";
      }
    });
  });
});
