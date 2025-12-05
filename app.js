const API_URL = "https://api-colombia.com/api/v1/Department";
const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const btnDark = document.getElementById("bm_oscuro");
const loader = document.getElementById("loader");

let departmentsData = [];

//Modo oscuro
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    btnDark.textContent = "☀️";
  }
});

btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  btnDark.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

//Fetch
async function getDepartments() {
  loader.classList.remove("hidden");

  try {
    const res = await fetch(API_URL);
    const departments = await res.json();

    // Información de los departamentos
    const detailedDeps = await Promise.all(
      departments.map((dep) =>
        fetch(`${API_URL}/${dep.id}`).then((r) => r.json())
      )
    );

    departmentsData = detailedDeps;
    renderDepartments(detailedDeps);

    loader.classList.add("hidden");
  } catch (error) {
    loader.classList.add("hidden");
    cardsContainer.innerHTML = "<p>Error al cargar datos</p>";
  }
}

getDepartments();

// reendirezar
function renderDepartments(deps) {
  cardsContainer.innerHTML = "";

  deps.forEach((dep) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const images = getDepartmentImages(dep.name);
    let index = 0;

    card.innerHTML = `
      <div class="img-box">
        <img class="dep-img" src="${images[index]}" alt="${dep.name}">
        <button class="btn-left">◀</button>
        <button class="btn-right">▶</button>
      </div>

      <h3>${dep.name}</h3>
      <p><strong>Capital:</strong> ${dep.cityCapital?.name || "N/A"}</p>
      <p><strong>Población:</strong> ${
        dep.population?.toLocaleString() || "N/A"
      }</p>
      <p><strong>Descripción:</strong> ${
        dep.description || "Sin información"
      }</p>
    `;

    cardsContainer.appendChild(card);

    const img = card.querySelector(".dep-img");

    card.querySelector(".btn-left").onclick = () => {
      index = (index - 1 + images.length) % images.length;
      img.src = images[index];
    };

    card.querySelector(".btn-right").onclick = () => {
      index = (index + 1) % images.length;
      img.src = images[index];
    };
  });
}

// buscador
searchInput.addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase();

  const filtered = departmentsData.filter((d) =>
    d.name.toLowerCase().includes(text)
  );

  renderDepartments(filtered);
});

// imagenes
function getDepartmentImages(name, ext = "jpg") {
  const folder = name.toLowerCase();
  return [
    `assets/departments/${folder}/1.${ext}`,
    `assets/departments/${folder}/2.${ext}`,
    `assets/departments/${folder}/3.${ext}`,
  ];
}
