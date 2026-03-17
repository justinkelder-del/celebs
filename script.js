const SUPABASE_URL = "https://izgdeuonjjznaikcmqkb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Z2RldW9uamp6bmFpa2NtcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjA3MjYsImV4cCI6MjA4OTMzNjcyNn0.bcj1JdyVeOk_RNmiG0jWZ08JtWpWV3v42ZK2ngaaspc";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const teams = [
  {
    id: "team-1",
    name: "Team 1",
    roster: [
      { category: "Barely Legal (18–22)", celeb: "Margot Robbie", year: "2012", image: "images/team-1/barely-legal.jpeg" },
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

let teamVoteCounts = {};
let overallVoteCounts = {};
let categoryVoteCounts = {};
const voterId = getOrCreateVoterId();

document.addEventListener("DOMContentLoaded", async () => {
  createStatusBar();
  await loadVotes();
  renderTeams();
});

function getOrCreateVoterId() {
  let id = localStorage.getItem("celebrity_voter_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("celebrity_voter_id", id);
  }
  return id;
}

function createStatusBar() {
  if (document.getElementById("statusBar")) return;

  const bar = document.createElement("div");
  bar.id = "statusBar";
  bar.style.maxWidth = "1400px";
  bar.style.margin = "0 auto 20px auto";
  bar.style.padding = "12px 16px";
  bar.style.borderRadius = "12px";
  bar.style.display = "none";
  bar.style.fontWeight = "600";
  bar.style.boxSizing = "border-box";

  const grid = document.getElementById("galleryGrid");
  document.body.insertBefore(bar, grid);
}

function setStatus(message, isError = false) {
  const bar = document.getElementById("statusBar");
  if (!bar) return;

  if (!message) {
    bar.style.display = "none";
    bar.textContent = "";
    return;
  }

  bar.style.display = "block";
  bar.textContent = message;
  bar.style.color = isError ? "#991b1b" : "#1e3a8a";
  bar.style.background = isError ? "#fee2e2" : "#dbeafe";
  bar.style.border = isError ? "1px solid #fecaca" : "1px solid #bfdbfe";
}

function getCategoryKey(teamId, category) {
  return `${teamId}|||${category}`;
}

async function loadVotes() {
  setStatus("Loading votes...");

  try {
    const teamRes = await supabaseClient.from("team_votes").select("team_id");
    if (teamRes.error) throw teamRes.error;

    const overallRes = await supabaseClient.from("overall_votes").select("team_id");
    if (overallRes.error) throw overallRes.error;

    const categoryRes = await supabaseClient.from("category_votes").select("team_id, category");
    if (categoryRes.error) throw categoryRes.error;

    teamVoteCounts = {};
    overallVoteCounts = {};
    categoryVoteCounts = {};

    for (const row of teamRes.data || []) {
      teamVoteCounts[row.team_id] = (teamVoteCounts[row.team_id] || 0) + 1;
    }

    for (const row of overallRes.data || []) {
      overallVoteCounts[row.team_id] = (overallVoteCounts[row.team_id] || 0) + 1;
    }

    for (const row of categoryRes.data || []) {
      const key = getCategoryKey(row.team_id, row.category);
      categoryVoteCounts[key] = (categoryVoteCounts[key] || 0) + 1;
    }

    setStatus("");
  } catch (error) {
    console.error("Error loading votes:", error);
    setStatus(`Could not load votes: ${error.message || "unknown error"}`, true);
  }
}

function renderTeams() {
  const container = document.getElementById("galleryGrid");
  if (!container) {
    console.error("galleryGrid not found");
    return;
  }

  const sortedTeams = [...teams].sort((a, b) => {
    const aVotes = teamVoteCounts[a.id] || 0;
    const bVotes = teamVoteCounts[b.id] || 0;
    return bVotes - aVotes;
  });

  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fit, minmax(320px, 1fr))";
  container.style.gap = "26px";
  container.style.alignItems = "start";

  sortedTeams.forEach(team => {
    const teamDiv = document.createElement("div");
    teamDiv.style.background = "#ffffff";
    teamDiv.style.border = "1px solid rgba(219, 227, 239, 0.7)";
    teamDiv.style.borderRadius = "28px";
    teamDiv.style.padding = "24px";
    teamDiv.style.boxShadow = "0 20px 50px rgba(20, 32, 51, 0.10)";
    teamDiv.style.boxSizing = "border-box";

    const title = document.createElement("h2");
    title.textContent = team.name;
    title.style.margin = "0 0 8px";
    title.style.fontSize = "2rem";

    const subtitle = document.createElement("p");
    subtitle.textContent = "Anonymous celebrity draft roster.";
    subtitle.style.margin = "0 0 14px";
    subtitle.style.color = "#5f6f86";

    const voteStats = document.createElement("div");
    voteStats.style.display = "flex";
    voteStats.style.gap = "16px";
    voteStats.style.flexWrap = "wrap";
    voteStats.style.margin = "0 0 20px";
    voteStats.style.fontSize = "14px";
    voteStats.style.color = "#334155";
    voteStats.innerHTML = `
      <div><strong>Team Votes:</strong> ${teamVoteCounts[team.id] || 0}</div>
      <div><strong>Best Overall:</strong> ${overallVoteCounts[team.id] || 0}</div>
    `;

    teamDiv.appendChild(title);
    teamDiv.appendChild(subtitle);
    teamDiv.appendChild(voteStats);

    team.roster.forEach(player => {
      const card = document.createElement("div");
      card.style.border = "1px solid #e2e8f0";
      card.style.borderRadius = "16px";
      card.style.overflow = "hidden";
      card.style.marginBottom = "16px";
      card.style.background = "#fff";

      const header = document.createElement("div");
      header.textContent = player.category;
      header.style.background = "#0f172a";
      header.style.color = "white";
      header.style.fontSize = "13px";
      header.style.fontWeight = "700";
      header.style.textTransform = "uppercase";
      header.style.padding = "10px 14px";

      const img = document.createElement("img");
      img.src = player.image;
      img.alt = player.celeb;
      img.style.width = "100%";
      img.style.aspectRatio = "3 / 4";
      img.style.height = "auto";
      img.style.objectFit = "cover";
      img.style.objectPosition = "top";
      img.style.display = "block";

      const info = document.createElement("div");
      info.style.padding = "12px";

      const name = document.createElement("div");
      name.textContent = player.celeb;
      name.style.fontWeight = "700";

      const year = document.createElement("div");
      year.textContent = `Peak year: ${player.year}`;
      year.style.color = "#475569";
      year.style.marginTop = "4px";

      info.appendChild(name);
      info.appendChild(year);

      const categoryKey = getCategoryKey(team.id, player.category);
      const categoryCount = categoryVoteCounts[categoryKey] || 0;

      const categoryCountDiv = document.createElement("div");
      categoryCountDiv.textContent = `Category Votes: ${categoryCount}`;
      categoryCountDiv.style.marginTop = "10px";
      categoryCountDiv.style.fontSize = "14px";
      categoryCountDiv.style.color = "#334155";

      const categoryButton = document.createElement("button");
      categoryButton.textContent = `Vote ${player.category}`;
      categoryButton.style.width = "100%";
      categoryButton.style.padding = "10px";
      categoryButton.style.marginTop = "10px";
      categoryButton.style.border = "none";
      categoryButton.style.borderRadius = "10px";
      categoryButton.style.background = "#475569";
      categoryButton.style.color = "white";
      categoryButton.style.cursor = "pointer";
      categoryButton.style.fontWeight = "600";
      categoryButton.addEventListener("click", () => voteCategory(team.id, player.category, categoryButton));

      info.appendChild(categoryCountDiv);
      info.appendChild(categoryButton);

      card.appendChild(header);
      card.appendChild(img);
      card.appendChild(info);

      teamDiv.appendChild(card);
    });

    const overallButton = document.createElement("button");
    overallButton.textContent = "Vote Best Overall";
    overallButton.style.width = "100%";
    overallButton.style.padding = "12px";
    overallButton.style.marginTop = "10px";
    overallButton.style.border = "none";
    overallButton.style.borderRadius = "12px";
    overallButton.style.background = "#0f172a";
    overallButton.style.color = "white";
    overallButton.style.cursor = "pointer";
    overallButton.style.fontWeight = "700";
    overallButton.addEventListener("click", () => voteOverall(team.id, overallButton));

    teamDiv.appendChild(voteButton);
    teamDiv.appendChild(overallButton);

    container.appendChild(teamDiv);
  });
}

async function voteCategory(teamId, category, button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Submitting...";

  try {
    const { error } = await supabaseClient
      .from("category_votes")
      .insert([{ team_id: teamId, category: category, voter_id: voterId }]);

    if (error) throw error;

    const key = getCategoryKey(teamId, category);
    categoryVoteCounts[key] = (categoryVoteCounts[key] || 0) + 1;
    renderTeams();
    setStatus(`Vote submitted for ${category}.`);
  } catch (error) {
    console.error("Category vote failed:", error);
    setStatus("Category vote failed.", true);
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function voteOverall(teamId, button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Submitting...";

  try {
    const { data: existingVote, error: checkError } = await supabaseClient
      .from("overall_votes")
      .select("team_id")
      .eq("voter_id", voterId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingVote) {
      setStatus("You already used your Best Overall vote.", true);
      button.disabled = false;
      button.textContent = originalText;
      return;
    }

    const { error: insertError } = await supabaseClient
      .from("overall_votes")
      .insert([{ team_id: teamId, voter_id: voterId }]);

    if (insertError) throw insertError;

    overallVoteCounts[teamId] = (overallVoteCounts[teamId] || 0) + 1;
    renderTeams();
    setStatus("Best Overall vote submitted.");
  } catch (error) {
    console.error("Overall vote failed:", error);
    setStatus("Overall vote failed.", true);
    button.disabled = false;
    button.textContent = originalText;
  }
}
