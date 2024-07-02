const messages = [
  "Vous n’avez aucune chance d’emporter le second tour, désistez-vous maintenant !",
  "Ça sera de votre faute si le RN passe, désistez-vous !",
  "Gardez votre honneur et désistez-vous !",
  "Vous ne gagnerez pas cette élection, conservez votre honneur et désistez-vous !",
  "Désistez-vous pour faire barrage au RN !",
];

const message = messages[Math.floor(Math.random() * messages.length)];
document.querySelector("#message").textContent = message;
document.querySelector("#message-container").onclick = () => {
  navigator.clipboard.writeText(message);
  document.querySelector("#copy-btn").textContent = "Copié !";
};

fetch("https://legislatives.fly.dev/")
  .then((response) => response.json())
  .then((data) => {
    const candidates = data.candidatsNonDesistes.filter((c) => !c.desiste);
    const count = candidates.length;
    console.log(candidates);

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
        <div class="left">
          <b>${candidate.nom}</b>
          <span>${candidate.parti} • ${candidate.circonscription} • ${
        candidate.score
      }%</span>
        </div>
        <div class="socials">
          ${
            candidate.insta
              ? `<a href="https://instagram.com/${candidate.insta.handle}" target="_blank"><img src="/instagram-logo.svg" /></a>`
              : ""
          }
          ${
            candidate.x
              ? `<a href="https://twitter.com/${candidate.x.handle}" target="_blank"><img src="/x-logo.svg" /></a>`
              : ""
          }
        </div>
      `;
      liste.appendChild(div);
    });
  });
