fetch("https://legislatives.fly.dev/")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const candidates = data.candidatsNonDesistes;
    const count = candidates.length;

    // all elements with class "number" will be updated with the count
    document.querySelectorAll(".number").forEach((el) => {
      el.textContent = count;
    });

    // we fill the table#candidates with the data
    const table = document.querySelector("#candidates");
    candidates.forEach((candidate) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${candidate.nom}</td>
      `;
      table.appendChild(tr);
    });
  });
