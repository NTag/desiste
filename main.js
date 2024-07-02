import { data } from "./data.js";

const messages = [
  "C’est le dernier moment ! Vous n’avez aucune chance d’emporter le second tour, désistez-vous maintenant ! desiste.fr",
  "C’est le dernier moment ! Ça sera de votre faute si le RN passe, désistez-vous ! desiste.fr",
  "C’est le dernier moment ! Gardez votre honneur et désistez-vous ! desiste.fr",
  "C’est le dernier moment ! Vous ne gagnerez pas cette élection, conservez votre honneur et désistez-vous ! desiste.fr",
  "C’est le dernier moment ! Désistez-vous pour faire barrage au RN ! desiste.fr Il faut faire un front républicain.",
];

document.querySelector(
  "#share"
).href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  "C’est le dernier moment : demandez aux candidats des triangulaires de se désister avant 18h 👉 desiste.fr #legislatives2024"
)}`;

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
