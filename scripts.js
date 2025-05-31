document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const loader = document.getElementById("loader");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection && (connection.saveData || connection.effectiveType.includes('2g') || connection.effectiveType === 'slow-2g')) {
    // Replace images with low-res versions
    document.querySelectorAll('img[data-low]').forEach(img => {
      img.src = img.dataset.low;
    });
  }

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
