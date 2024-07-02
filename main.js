fetch("https://legislatives.fly.dev/")
  .then((response) => response.json())
  .then((data) => {
    const candidates = data.candidatsNonDesistes;
    const count = candidates.length;

    // all elements with class "number" will be updated with the count
    document.querySelectorAll(".number").forEach((el) => {
      el.textContent = count;
    });
  });
