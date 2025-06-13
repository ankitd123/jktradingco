document.addEventListener("DOMContentLoaded", () => {

  // Mobile Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    hamburger.setAttribute("aria-expanded", navMenu.classList.contains("active"));
    navMenu.classList.toggle('active');
  });

  // Auto-close on link click
  navLinks.forEach(link =>
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    })
  );

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
        showToast("Your inquiry has been sent successfully.", "success");
        form.reset();
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.style.color = "red";
            status.textContent = data["errors"].map(error => error.message).join(", ");
          } else {
            showToast("There was an error sending your message.", "error");
          }
        })
      }
    })
    .catch(() => {
      loader.classList.remove("active");
        showToast("There was an error sending your message.", "error");
    });
  });


  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconPath = "";
    if (type === "success") {
      iconPath = "images/misc/green-tick.png"; // ✅ your uploaded image
    } else if (type === "error") {
      iconPath = "images/misc/red-cross.png"; // ❌ if you have one
    }

    toast.innerHTML = `
      <img src="${iconPath}" alt="${type} icon" class="toast-icon-image" />
      <span>${message}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }






  const points = document.querySelectorAll(".parallax-points .point");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    root: null,
    threshold: 0.1
  });

  points.forEach(point => observer.observe(point));

  const overlay = document.getElementById("image-modal");
  const overlayImg = document.getElementById("modal-image");
  const overlayText = document.getElementById("modal-caption");
  const body = document.body;

  document.querySelectorAll(".product-list li").forEach((item) => {
    const img = item.querySelector("img");
    const name = item.querySelector(".product-name");

    const openModal = () => {
      overlayImg.src = img.src;
      overlayText.textContent = name.textContent;
      overlay.classList.add("active");
      body.style.overflow = "hidden";
    };

    img.addEventListener("click", openModal);
    name.addEventListener("click", openModal);
  });

  // Close modal on click anywhere
  document.getElementById("image-modal").addEventListener("click", () => {
    overlay.classList.remove("active");
    overlayImg.src = "";
    overlayText.textContent = "";
    body.style.overflow = "";
  });
});
