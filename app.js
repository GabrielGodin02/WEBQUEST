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

  // --- Procesos: acordeón interactivo ---
  document.querySelectorAll(".proceso-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.parentElement;
      card.classList.toggle("open");
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

    // Tarea 1
    evalReloj: document.getElementById("evalReloj").value,
    evalPuerta: document.getElementById("evalPuerta").value,

    // Tarea 2
    evalCirculoExp: document.getElementById("evalCirculoExp").value,
    evalTrianguloExp: document.getElementById("evalTrianguloExp").value,

    // Tarea 3
    evalCasa: document.getElementById("evalCasa").value,
    evalCreativo: document.getElementById("evalCreativo").value,

    // Juego
    evalJuegoExp: document.getElementById("evalJuegoExp").value
  };

  const mensaje = document.getElementById("mensajeConfirmacion");

  fetch("https://script.google.com/macros/s/AKfycbwJzMYfws9sjayW4VhtScUn63IMGG_YQfumvDFuLR193164wVM350ouaHdmiagPkTGppQ/exec", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(text => {
    mensaje.textContent = "✅ ¡Evaluación enviada con éxito!";
    mensaje.className = "mensaje-confirmacion mensaje-exito";
    mensaje.style.display = "block";
    document.getElementById("evalForm").reset();

    setTimeout(() => {
      mensaje.style.display = "none";
    }, 5000);
  })
  .catch(err => {
    mensaje.textContent = "❌ Error al enviar: " + err;
    mensaje.className = "mensaje-confirmacion mensaje-error";
    mensaje.style.display = "block";

    setTimeout(() => {
      mensaje.style.display = "none";
    }, 5000);
  });
});