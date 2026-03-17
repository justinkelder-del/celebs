const teams = [

  // TEAM 1
  {
    id: "team-1",
    name: "Team 1",
    roster: [
      { category: "Barely Legal (18–22)", celeb: "Margot Robbie", year: "2022", image: "images/team-1/barely-legal.jpeg" },
      { category: "Prime (23–30)", celeb: "Jessica Alba", year: "2007", image: "images/team-1/prime.jpeg" },
      { category: "Mature (30–45)", celeb: "Natalie Portman", year: "2025", image: "images/team-1/mature.jpeg" },
      { category: "Veteran (45–62)", celeb: "Salma Hayek", year: "2025", image: "images/team-1/veteran.jpeg" },
      { category: "Legend (63+)", celeb: "Christie Brinkley", year: "2017", image: "images/team-1/legend.jpeg" },
      { category: "Comedian", celeb: "Annie Agar", year: "2025", image: "images/team-1/comedian.jpeg" },
      { category: "Musician", celeb: "Shakira", year: "2025", image: "images/team-1/musician.jpeg" },
      { category: "Victoria’s Secret Model", celeb: "Miranda Kerr", year: "2009", image: "images/team-1/vs-model.jpeg" },
      { category: "SI Swimsuit Model", celeb: "Tyra Banks", year: "1997", image: "images/team-1/si-model.jpeg" }
    ]
  },

  // TEAM 2
  {
    id: "team-2",
    name: "Team 2",
    roster: [
      { category: "Barely Legal (18–22)", celeb: "Brigitte Bardot", year: "1956", image: "images/team-2/barely-legal.jpeg" },
      { category: "Prime (23–30)", celeb: "Sydney Sweeney", year: "2025", image: "images/team-2/prime.jpeg" },
      { category: "Mature (30–45)", celeb: "Halle Berry", year: "2025", image: "images/team-2/mature.jpeg" },
      { category: "Veteran (45–62)", celeb: "Hannah Waddingham", year: "2025", image: "images/team-2/veteran.jpeg" },
      { category: "Legend (63+)", celeb: "Susanna Hoffs", year: "2025", image: "images/team-2/legend.jpeg" },
      { category: "Comedian", celeb: "Sarah Silverman", year: "2015", image: "images/team-2/comedian.jpeg" },
      { category: "Musician", celeb: "Sophia Loren", year: "1956", image: "images/team-2/musician.jpeg" },
      { category: "Victoria’s Secret Model", celeb: "Rosie Huntington-Whiteley", year: "2010", image: "images/team-2/vs-model.jpeg" },
      { category: "SI Swimsuit Model", celeb: "Kate Upton", year: "2003", image: "images/team-2/si-model.jpeg" }
    ]
  },

  // TEAM 3
  {
    id: "team-3",
    name: "Team 3",
    roster: [
      { category: "Barely Legal (18–22)", celeb: "Jennifer Love Hewitt", year: "1998", image: "images/team-3/barely-legal.jpeg" },
      { category: "Prime (23–30)", celeb: "Scarlett Johansson", year: "2008", image: "images/team-3/prime.jpeg" },
      { category: "Mature (30–45)", celeb: "Ana de Armas", year: "2026", image: "images/team-3/mature.jpeg" },
      { category: "Veteran (45–62)", celeb: "Sofia Vergara", year: "2017", image: "images/team-3/veteran.jpeg" },
      { category: "Legend (63+)", celeb: "Demi Moore", year: "2026", image: "images/team-3/legend.jpeg" },
      { category: "Comedian", celeb: "Iliza Shlesinger", year: "2009", image: "images/team-3/comedian.jpeg" },
      { category: "Musician", celeb: "Britney Spears", year: "2001", image: "images/team-3/musician.jpg" },
      { category: "Victoria’s Secret Model", celeb: "Adriana Lima", year: "2017", image: "images/team-3/vs-model.jpeg" },
      { category: "SI Swimsuit Model", celeb: "Elle MacPherson", year: "1988", image: "images/team-3/si-model.jpeg" }
    ]
  }

];

function renderTeams() {
  const container = document.getElementById("galleryGrid");
  container.innerHTML = "";

  teams.forEach(team => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "card";
    teamDiv.style.padding = "24px";
    teamDiv.style.borderRadius = "28px";
    teamDiv.style.background = "#ffffff";
    teamDiv.style.boxShadow = "0 20px 50px rgba(20, 32, 51, 0.10)";
    teamDiv.style.border = "1px solid rgba(219, 227, 239, 0.7)";

    const title = document.createElement("h2");
    title.textContent = team.name;
    title.style.margin = "0 0 8px";
    title.style.fontSize = "2rem";
    title.style.color = "#142033";

    const subtitle = document.createElement("p");
    subtitle.textContent = "Anonymous celebrity draft roster.";
    subtitle.style.margin = "0 0 20px";
    subtitle.style.color = "#5f6f86";
    subtitle.style.fontSize = "1rem";

    teamDiv.appendChild(title);
    teamDiv.appendChild(subtitle);

    team.roster.forEach(player => {
      const card = document.createElement("div");
      card.style.border = "1px solid #e2e8f0";
      card.style.borderRadius = "16px";
      card.style.overflow = "hidden";
      card.style.background = "#ffffff";
      card.style.marginBottom = "16px";

      card.innerHTML = `
        <div style="
          background:#0f172a;
          color:white;
          font-size:13px;
          font-weight:700;
          letter-spacing:.05em;
          text-transform:uppercase;
          padding:10px 14px;
        ">
          ${player.category}
        </div>

        <img 
          src="${player.image}" 
          alt="${player.celeb}" 
          style="
            width:100%;
            height:260px;
            object-fit:cover;
            display:block;
            background:#e2e8f0;
          "
        />

        <div style="padding:12px;">
          <div style="font-size:16px; font-weight:700; color:#0f172a;">
            ${player.celeb}
          </div>
          <div style="font-size:14px; color:#475569;">
            Peak year: ${player.year}
          </div>
        </div>
      `;

      teamDiv.appendChild(card);
    });

    container.appendChild(teamDiv);
  });
}

renderTeams();
