const url = "https://script.google.com/macros/s/AKfycbzQC9Il1bTAaK9BqHspOXvWC52VlzwWSLJIp5clE7l9sq1LKnmEX1wIq4I2RYzPEviCDg/exec";

document.addEventListener("DOMContentLoaded", () => {

  const estudiantes = [
    { nombre: "ALI MAMANI ASCENCIO", genero: "M" },
    { nombre: "CALATAYUD YUJRA BRENDA MAYTE", genero: "F" },
    { nombre: "CHINO COYO GENESIS CECILIA", genero: "F" },
    { nombre: "CHOQUE APAZA ALEX WILDER", genero: "M" },
    { nombre: "CORINA QUISPE JUAN FERNANDO", genero: "M" },
  ];

  const tbody = document.querySelector("#tablaAsistencia tbody");
  const thead = document.querySelector("#tablaAsistencia thead tr");
  const fechaInput = document.getElementById("fecha");
  const btnAgregar = document.getElementById("agregarFecha");

  // 🟢 CARGAR ESTUDIANTES
  estudiantes.forEach((e, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${e.nombre}</td>
      <td>${e.genero}</td>
    `;
    tbody.appendChild(tr);
  });

  // 📅 AGREGAR FECHA
  btnAgregar.addEventListener("click", () => {

    const fecha = fechaInput.value;
    if (!fecha) return alert("Selecciona una fecha");

    // evitar duplicados
    const fechasExistentes = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);
    if (fechasExistentes.includes(fecha)) {
      return alert("Esa fecha ya fue agregada");
    }

    const th = document.createElement("th");
    th.textContent = fecha;
    thead.appendChild(th);

    document.querySelectorAll("#tablaAsistencia tbody tr").forEach(tr => {
      const td = document.createElement("td");

      td.innerHTML = `
        <select required class="estado-select">
          <option value="">--</option>
          <option value="P">🟢 Presente</option>
          <option value="A">🟡 Atraso</option>
          <option value="F">🔴 Falta</option>
          <option value="L">🔵 Licencia</option>
        </select>
      `;

      // 🎨 CAMBIO DE COLOR SEGÚN ESTADO
      td.querySelector("select").addEventListener("change", function () {
        const valor = this.value;
        this.style.background =
          valor === "P" ? "#c8f7c5" :
          valor === "A" ? "#fff3cd" :
          valor === "F" ? "#f8d7da" :
          valor === "L" ? "#d1ecf1" : "white";
      });

      tr.appendChild(td);
    });

    fechaInput.value = "";
  });

  // 🚀 ENVIAR DATOS
document.getElementById("asistenciaForm").addEventListener("submit", async e => {
  e.preventDefault();

  const filas = document.querySelectorAll("#tablaAsistencia tbody tr");
  const fechas = document.querySelectorAll("#tablaAsistencia thead th");
  const loading = document.getElementById("loading");
  const boton = document.querySelector(".btn-registrar");

  // validar
  for (const tr of filas) {
    for (let i = 3; i < tr.cells.length; i++) {
      if (!tr.cells[i].querySelector("select").value) {
        return alert("Completa toda la asistencia");
      }
    }
  }

  try {
    // 🔄 MOSTRAR LOADING
    loading.style.display = "block";
    boton.disabled = true;
    boton.textContent = "Enviando...";

    for (let i = 0; i < filas.length; i++) {
      const nombre = filas[i].children[1].textContent;

      for (let j = 3; j < filas[i].children.length; j++) {
        const valor = filas[i].children[j].querySelector("select").value;
        const fecha = fechas[j].textContent;

        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            nombre,
            fecha,
            estado: valor
          })
        });
      }
    }

    document.getElementById("modalExito").style.display = "flex";

  } catch (error) {
    console.error(error);
    alert("Error al enviar datos");
  } finally {
    // 🔁 OCULTAR LOADING
    loading.style.display = "none";
    boton.disabled = false;
    boton.textContent = "Registrar y Enviar";
  }
});

  // ❌ CERRAR MODAL
  document.getElementById("btnCerrar").onclick = () => {
    document.getElementById("modalExito").style.display = "none";
  };
  alert("✅ Asistencia registrada correctamente");
});