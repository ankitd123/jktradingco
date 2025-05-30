document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    loader.classList.add("active");

    const formData = new FormData(form);
    fetch(form.action, {
      method: form.method,
      headers: {
        'Accept': 'application/json'
      },
      body: formData,
    })
    .then(response => {
      loader.classList.remove("active");
      if (response.ok) {
        status.style.color = "lightgreen";
        status.textContent = "Thank you! Your message has been sent.";
        form.reset();
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.style.color = "red";
            status.textContent = data["errors"].map(error => error.message).join(", ");
          } else {
            status.style.color = "red";
            status.textContent = "Oops! There was a problem submitting your form";
          }
        })
      }
    })
    .catch(() => {
      loader.classList.remove("active");
      status.style.color = "red";
      status.textContent = "Oops! There was a problem submitting your form";
    });
  });
});
