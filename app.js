// --- Menú lateral ---
function toggleDrawer() {
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");
  drawer.classList.toggle("open");
  overlay.classList.toggle("show");
}

function navigate(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
  toggleDrawer();
}

// --- Submenú de tareas ---
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".submenu-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const submenu = btn.parentElement;
      submenu.classList.toggle("open");
    });
  });
});

// --- Juego ---
function nextLevel(nivel, correcto) {
  if (correcto) {
    document.getElementById("nivel" + nivel).classList.add("hidden");
    document.getElementById("nivel" + (nivel + 1)).classList.remove("hidden");
  } else {
    alert("❌ Intenta de nuevo");
  }
}

// --- Tarea 1: Validar nombres de figuras ---
function validarRespuestas() {
  const respuestas = [
    {id: "resp1", correctas: ["circulo", "círculo"]},
    {id: "resp2", correctas: ["triangulo", "triángulo"]},
    {id: "resp3", correctas: ["cuadrado"]},
    {id: "resp4", correctas: ["rectangulo", "rectángulo"]}
  ];

  respuestas.forEach(r => {
    const input = document.getElementById(r.id);
    let valor = input.value.trim().toLowerCase();
    valor = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const esCorrecto = r.correctas.some(c => {
      let normalizado = c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return valor === normalizado;
    });

    if (esCorrecto) {
      input.style.border = "2px solid green";
    } else {
      input.style.border = "2px solid red";
    }
  });
}

// --- Evaluación: Enviar respuestas a Google Sheets ---
document.getElementById("evalForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    pregunta1: document.querySelector('input[name="pregunta1"]:checked').value,
    pregunta2: document.querySelector('input[name="pregunta2"]:checked').value
  };

  const mensaje = document.getElementById("mensajeConfirmacion");

  fetch("https://script.google.com/macros/s/AKfycbzj9vez3F4V2fb11PLkksq4vZLTh-2TozZ8Q-K5BErHmVuw_3WrgNSvP2427SqIQX7LIQ/exec", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(text => {
    mensaje.textContent = "✅ ¡Respuestas enviadas con éxito!";
    mensaje.className = "mensaje-confirmacion mensaje-exito";
    mensaje.style.display = "block";
    document.getElementById("evalForm").reset();

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      mensaje.style.display = "none";
    }, 5000);
  })
  .catch(err => {
    mensaje.textContent = "❌ Error al enviar: " + err;
    mensaje.className = "mensaje-confirmacion mensaje-error";
    mensaje.style.display = "block";

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      mensaje.style.display = "none";
    }, 5000);
  });
});