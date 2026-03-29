const counter = document.getElementById("km-counter");

async function loadKm() {
  try {
    const response = await fetch("/api/km");
    const data = await response.json();

    if (counter) {
      counter.textContent = data.km + "KM";
    }
  } catch (error) {
    console.error("Erreur chargement compteur :", error);
  }
}

loadKm();