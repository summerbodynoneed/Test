const counter = document.getElementById("km-counter");

if (counter) {
  let value = 0;
  const target = 100;

  const interval = setInterval(() => {
    value++;

    counter.textContent = value + "KM";

    if (value >= target) {
      clearInterval(interval);
    }
  }, 20);
}