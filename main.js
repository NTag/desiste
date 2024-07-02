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
    const liste = document.querySelector("#candidates");
    candidates.forEach((candidate, i) => {
      if (i > 0) {
        const hr = document.createElement("hr");
        liste.appendChild(hr);
      }
      const div = document.createElement("div");
      div.classList.add("candidate");
      div.innerHTML = `
        <div class="name">${candidate.nom}</div>
        <div class="socials">
          ${
            candidate.insta &&
            `<a href="https://instagram.com/${candidate.insta}" target="_blank"><img src="/instagram-logo.svg" /></a>`
          }
        </div>
      `;
      liste.appendChild(div);
    });
  });
