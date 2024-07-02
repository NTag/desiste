function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

const messages = [
  "Vous n’avez aucune chance d’emporter le second tour, désistez-vous maintenant ! desiste.fr",
  "Ça sera de votre faute si le RN passe, désistez-vous ! desiste.fr",
  "Gardez votre honneur et désistez-vous ! desiste.fr",
  "Vous ne gagnerez pas cette élection, conservez votre honneur et désistez-vous ! desiste.fr",
  "Désistez-vous pour faire barrage au RN ! desiste.fr",
];

const getTwitterURL = (handle) => {
  const message = messages[Math.floor(Math.random() * messages.length)];
  const text = `@${handle} ${message} #legislatives2024`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};

const message = messages[Math.floor(Math.random() * messages.length)];
document.querySelector("#message").textContent = message;
document.querySelector("#message-container").onclick = () => {
  copyTextToClipboard(message);
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
          <b class="name">${candidate.nom}</b>
          <span>${candidate.parti} • ${candidate.circonscription} • ${
        candidate.score
      }%</span>
        </div>
        <div class="socials">
          ${
            candidate.insta?.handle
              ? `<a href="https://instagram.com/${candidate.insta.handle}" target="_blank"><img src="/instagram-logo.svg" /></a>`
              : ""
          }
          ${
            candidate.x?.handle
              ? `<a href="${getTwitterURL(
                  candidate.x?.handle
                )}" target="_blank"><img src="/x-logo.svg" /></a>`
              : ""
          }
        </div>
      `;
      liste.appendChild(div);
    });
  });
