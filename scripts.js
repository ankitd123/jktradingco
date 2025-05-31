document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const loader = document.getElementById("loader");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (navigator.connection) {
    console.log("Effective Connection Type:", navigator.connection.effectiveType);
    console.log("Estimated Downlink (Mbps):", navigator.connection.downlink);
    console.log("RTT (ms):", navigator.connection.rtt);
    console.log("Save Data:", navigator.connection.saveData);
  } else {
    console.log("Network Information API not supported.");
  }

  if (connection) {
    const type = connection.effectiveType;
    const saveData = connection.saveData;

    // Match for slow networks or data-saver mode
    const isLowBandwidth = saveData || ['slow-2g', '2g', '3g'].includes(type);

    if (isLowBandwidth) {
      document.querySelectorAll('img[data-low]').forEach(img => {
        if (img.dataset.low) {
          img.src = img.dataset.low;
        }
      });
    }
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
