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

function getBadgeColor(parti) {
  const colors = {
    LR: "#0890C5",
    "HOR.-ENSEMBLE": "#FF9F0E",
    "DIV. DR.": "#6387A8",
    "REN.-ENSEMBLE": "#FF9F0E",
    "MODEM-ENSEMBLE": "#FF9F0E",
    "DIV. G.": "#DA679E",
  };

  return colors[parti] || "black";
}

fetch("https://legislatives.fly.dev/")
  .then((response) => response.json())
  .then((data) => {
    const candidates = data.candidatsNonDesistes;
    candidates.sort((a, b) => {
      // first the non desiste
      // then by higher score

      if (a.desiste && !b.desiste) {
        return 1;
      }

      if (!a.desiste && b.desiste) {
        return -1;
      }

      return b.score - a.score;
    });
    const count = data.candidatsNonDesistes.filter((c) => !c.desiste).length;
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
      const div = document.createElement("a");
      const scoreRN = candidate.scoresMeilleurs.find(
        (s) => s.parti === "LR-RN" || s.parti === "RN"
      ).score;
      console.log(scoreRN);
      div.classList.add("candidate");
      if (candidate.desiste) {
        div.classList.add("desiste");
      }
      div.href = getTwitterURL(candidate.x?.handle);
      div.innerHTML = `
        <div class="left">
          <div class="name"><b>${
            candidate.nom
          }</b> <div class="badge" style="background-color: ${getBadgeColor(
        candidate.parti
      )}">${candidate.parti}</div></div>
          <span>${candidate.circonscription} • ${
        candidate.score
      }% (vs RN à ${scoreRN}%)</span>
        </div>
        <div class="right">
        </div>
      `;
      liste.appendChild(div);
    });
  });
