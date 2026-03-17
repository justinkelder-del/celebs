const SUPABASE_URL = "https://izgdeuonjjznaikcmqkb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const supabaseClient = window.supabase.createClient(
  "https://izgdeuonjjznaikcmqkb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Z2RldW9uamp6bmFpa2NtcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjA3MjYsImV4cCI6MjA4OTMzNjcyNn0.bcj1JdyVeOk_RNmiG0jWZ08JtWpWV3v42ZK2ngaaspc"
);

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

let overallVoteCounts = {};
let categoryVoteCounts = {};
let myCategoryVotes = {};
let myOverallVoteTeamId = null;

const voterId = getOrCreateVoterId();

document.addEventListener("DOMContentLoaded", async () => {
  createStatusBar();
  await loadVotes();
  renderPage();
  window.addEventListener("resize", renderPage);
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
  bar.style.margin = "0 auto 16px auto";
  bar.style.padding = "12px 16px";
  bar.style.borderRadius = "12px";
  bar.style.display = "none";
  bar.style.fontWeight = "600";
  bar.style.boxSizing = "border-box";
  document.body.insertBefore(bar, document.getElementById("galleryGrid"));
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

function getAllCategories() {
  return teams[0].roster.map(player => player.category);
}

function findPlayer(team, category) {
  return team.roster.find(player => player.category === category);
}

async function loadVotes() {
  setStatus("Loading votes...");
  try {
    const overallRes = await supabaseClient.from("overall_votes").select("team_id");
    if (overallRes.error) throw overallRes.error;

    const categoryRes = await supabaseClient.from("category_votes").select("team_id, category");
    if (categoryRes.error) throw categoryRes.error;

    const myOverallRes = await supabaseClient
      .from("overall_votes")
      .select("team_id")
      .eq("voter_id", voterId)
      .maybeSingle();
    if (myOverallRes.error) throw myOverallRes.error;

    const myCategoryRes = await supabaseClient
      .from("category_votes")
      .select("team_id, category")
      .eq("voter_id", voterId);
    if (myCategoryRes.error) throw myCategoryRes.error;

    overallVoteCounts = {};
    categoryVoteCounts = {};
    myCategoryVotes = {};
    myOverallVoteTeamId = myOverallRes.data ? myOverallRes.data.team_id : null;

    for (const row of overallRes.data || []) {
      overallVoteCounts[row.team_id] = (overallVoteCounts[row.team_id] || 0) + 1;
    }

    for (const row of categoryRes.data || []) {
      const key = getCategoryKey(row.team_id, row.category);
      categoryVoteCounts[key] = (categoryVoteCounts[key] || 0) + 1;
    }

    for (const row of myCategoryRes.data || []) {
      myCategoryVotes[row.category] = row.team_id;
    }

    setStatus("");
  } catch (error) {
    console.error("Error loading votes:", error);
    setStatus(`Could not load votes: ${error.message || "unknown error"}`, true);
  }
}

function renderPage() {
  if (window.innerWidth <= 900) {
    renderMobileComparison();
  } else {
    renderDesktopTeams();
  }
}

function renderDesktopTeams() {
  const container = document.getElementById("galleryGrid");
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(3, 1fr)";
  container.style.gap = "26px";
  container.style.alignItems = "start";

  const sortedTeams = [...teams].sort((a, b) => {
    const aVotes = overallVoteCounts[a.id] || 0;
    const bVotes = overallVoteCounts[b.id] || 0;
    return bVotes - aVotes;
  });

  sortedTeams.forEach(team => {
    container.appendChild(buildTeamColumn(team));
  });
}

function renderMobileComparison() {
  const container = document.getElementById("galleryGrid");
  container.innerHTML = "";
  container.style.display = "block";

  getAllCategories().forEach(category => {
    const section = document.createElement("section");
    section.style.marginBottom = "28px";

    const heading = document.createElement("h2");
    heading.textContent = category;
    heading.style.margin = "0 0 12px";
    heading.style.fontSize = "1.2rem";
    heading.style.color = "#0f172a";

    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1fr";
    row.style.gap = "14px";

    teams.forEach(team => {
      const player = findPlayer(team, category);
      row.appendChild(buildMobileCategoryCard(team, player));
    });

    section.appendChild(heading);
    section.appendChild(row);
    container.appendChild(section);
  });

  const overallSection = document.createElement("section");
  overallSection.style.marginTop = "36px";

  const overallHeading = document.createElement("h2");
  overallHeading.textContent = "Best Overall";
  overallHeading.style.margin = "0 0 12px";
  overallHeading.style.fontSize = "1.2rem";
  overallHeading.style.color = "#0f172a";

  const overallGrid = document.createElement("div");
  overallGrid.style.display = "grid";
  overallGrid.style.gridTemplateColumns = "1fr";
  overallGrid.style.gap = "14px";

  const sortedTeams = [...teams].sort((a, b) => (overallVoteCounts[b.id] || 0) - (overallVoteCounts[a.id] || 0));
  sortedTeams.forEach(team => {
    overallGrid.appendChild(buildOverallOnlyCard(team));
  });

  overallSection.appendChild(overallHeading);
  overallSection.appendChild(overallGrid);
  container.appendChild(overallSection);
}

function buildTeamColumn(team) {
  const isMyOverallTeam = myOverallVoteTeamId === team.id;

  const teamDiv = document.createElement("div");
  teamDiv.style.background = isMyOverallTeam ? "#eff6ff" : "#ffffff";
  teamDiv.style.border = isMyOverallTeam ? "2px solid #2563eb" : "1px solid rgba(219, 227, 239, 0.7)";
  teamDiv.style.borderRadius = "28px";
  teamDiv.style.padding = "24px";
  teamDiv.style.boxShadow = isMyOverallTeam ? "0 20px 50px rgba(37, 99, 235, 0.16)" : "0 20px 50px rgba(20, 32, 51, 0.10)";
  teamDiv.style.boxSizing = "border-box";

  const title = document.createElement("h2");
  title.textContent = team.name;
  title.style.margin = "0 0 8px";
  title.style.fontSize = "2rem";

  const subtitle = document.createElement("p");
  subtitle.textContent = isMyOverallTeam ? "Your Best Overall vote is on this team." : "Anonymous celebrity draft roster.";
  subtitle.style.margin = "0 0 14px";
  subtitle.style.color = isMyOverallTeam ? "#1d4ed8" : "#5f6f86";
  subtitle.style.fontWeight = isMyOverallTeam ? "700" : "400";

  const voteStats = document.createElement("div");
  voteStats.style.margin = "0 0 20px";
  voteStats.style.fontSize = "14px";
  voteStats.style.color = "#334155";
  voteStats.innerHTML = `<div><strong>Best Overall Votes:</strong> ${overallVoteCounts[team.id] || 0}</div>`;

  teamDiv.appendChild(title);
  teamDiv.appendChild(subtitle);
  teamDiv.appendChild(voteStats);

  team.roster.forEach(player => {
    teamDiv.appendChild(buildPlayerCard(team, player));
  });

  teamDiv.appendChild(buildOverallButton(team));
  return teamDiv;
}

function buildPlayerCard(team, player) {
  const key = getCategoryKey(team.id, player.category);
  const categoryCount = categoryVoteCounts[key] || 0;
  const myVoteForThisCategory = myCategoryVotes[player.category] || null;
  const iVotedThisCard = myVoteForThisCategory === team.id;
  const categoryLockedElsewhere = myVoteForThisCategory && myVoteForThisCategory !== team.id;

  const card = document.createElement("div");
  card.style.border = iVotedThisCard ? "2px solid #2563eb" : "1px solid #e2e8f0";
  card.style.borderRadius = "16px";
  card.style.overflow = "hidden";
  card.style.marginBottom = "16px";
  card.style.background = iVotedThisCard ? "#eff6ff" : "#fff";

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

  const countDiv = document.createElement("div");
  countDiv.textContent = `Category Votes: ${categoryCount}`;
  countDiv.style.marginTop = "10px";
  countDiv.style.fontSize = "14px";
  countDiv.style.color = "#334155";

  const label = document.createElement("div");
  label.style.marginTop = "8px";
  label.style.fontSize = "13px";
  label.style.fontWeight = "700";
  if (iVotedThisCard) {
    label.textContent = "You voted for this category here.";
    label.style.color = "#1d4ed8";
  } else if (categoryLockedElsewhere) {
    label.textContent = "You already voted in this category on another team.";
    label.style.color = "#7c2d12";
  }

  const button = document.createElement("button");
  if (iVotedThisCard) {
    button.textContent = "Voted";
    button.disabled = true;
    button.style.background = "#2563eb";
  } else if (categoryLockedElsewhere) {
    button.textContent = "Already Voted in Category";
    button.disabled = true;
    button.style.background = "#94a3b8";
  } else {
    button.textContent = `Vote ${player.category}`;
    button.style.background = "#475569";
    button.addEventListener("click", () => voteCategory(team.id, player.category, button));
  }

  button.style.width = "100%";
  button.style.padding = "10px";
  button.style.marginTop = "10px";
  button.style.border = "none";
  button.style.borderRadius = "10px";
  button.style.color = "white";
  button.style.cursor = button.disabled ? "not-allowed" : "pointer";
  button.style.fontWeight = "600";

  info.appendChild(name);
  info.appendChild(year);
  info.appendChild(countDiv);
  info.appendChild(label);
  info.appendChild(button);

  card.appendChild(header);
  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function buildMobileCategoryCard(team, player) {
  const key = getCategoryKey(team.id, player.category);
  const categoryCount = categoryVoteCounts[key] || 0;
  const myVoteForThisCategory = myCategoryVotes[player.category] || null;
  const iVotedThisCard = myVoteForThisCategory === team.id;
  const categoryLockedElsewhere = myVoteForThisCategory && myVoteForThisCategory !== team.id;

  const card = document.createElement("div");
  card.style.background = iVotedThisCard ? "#eff6ff" : "#fff";
  card.style.border = iVotedThisCard ? "2px solid #2563eb" : "1px solid #e2e8f0";
  card.style.borderRadius = "18px";
  card.style.padding = "12px";
  card.style.boxShadow = "0 10px 24px rgba(20,32,51,0.08)";

  const teamLabel = document.createElement("div");
  teamLabel.textContent = team.name;
  teamLabel.style.fontWeight = "700";
  teamLabel.style.marginBottom = "10px";
  teamLabel.style.color = "#0f172a";

  const row = document.createElement("div");
  row.style.display = "grid";
  row.style.gridTemplateColumns = "92px 1fr";
  row.style.gap = "12px";
  row.style.alignItems = "start";

  const img = document.createElement("img");
  img.src = player.image;
  img.alt = player.celeb;
  img.style.width = "92px";
  img.style.height = "120px";
  img.style.objectFit = "cover";
  img.style.objectPosition = "top";
  img.style.borderRadius = "12px";
  img.style.display = "block";

  const content = document.createElement("div");

  const name = document.createElement("div");
  name.textContent = player.celeb;
  name.style.fontWeight = "700";

  const year = document.createElement("div");
  year.textContent = `Peak year: ${player.year}`;
  year.style.color = "#475569";
  year.style.marginTop = "4px";
  year.style.fontSize = "14px";

  const count = document.createElement("div");
  count.textContent = `Votes: ${categoryCount}`;
  count.style.marginTop = "8px";
  count.style.fontSize = "14px";
  count.style.color = "#334155";

  const note = document.createElement("div");
  note.style.marginTop = "8px";
  note.style.fontSize = "12px";
  note.style.fontWeight = "700";
  if (iVotedThisCard) {
    note.textContent = "Your vote";
    note.style.color = "#1d4ed8";
  } else if (categoryLockedElsewhere) {
    note.textContent = "Already voted elsewhere";
    note.style.color = "#7c2d12";
  }

  const button = document.createElement("button");
  if (iVotedThisCard) {
    button.textContent = "Voted";
    button.disabled = true;
    button.style.background = "#2563eb";
  } else if (categoryLockedElsewhere) {
    button.textContent = "Already Voted";
    button.disabled = true;
    button.style.background = "#94a3b8";
  } else {
    button.textContent = "Vote";
    button.style.background = "#475569";
    button.addEventListener("click", () => voteCategory(team.id, player.category, button));
  }

  button.style.width = "100%";
  button.style.padding = "10px";
  button.style.marginTop = "10px";
  button.style.border = "none";
  button.style.borderRadius = "10px";
  button.style.color = "white";
  button.style.fontWeight = "600";
  button.style.cursor = button.disabled ? "not-allowed" : "pointer";

  content.appendChild(name);
  content.appendChild(year);
  content.appendChild(count);
  content.appendChild(note);
  content.appendChild(button);

  row.appendChild(img);
  row.appendChild(content);

  card.appendChild(teamLabel);
  card.appendChild(row);

  return card;
}

function buildOverallOnlyCard(team) {
  const isMyOverallTeam = myOverallVoteTeamId === team.id;

  const card = document.createElement("div");
  card.style.background = isMyOverallTeam ? "#eff6ff" : "#fff";
  card.style.border = isMyOverallTeam ? "2px solid #2563eb" : "1px solid #e2e8f0";
  card.style.borderRadius = "18px";
  card.style.padding = "16px";
  card.style.boxShadow = "0 10px 24px rgba(20,32,51,0.08)";

  const title = document.createElement("div");
  title.textContent = team.name;
  title.style.fontWeight = "700";
  title.style.fontSize = "1.1rem";

  const count = document.createElement("div");
  count.textContent = `Best Overall Votes: ${overallVoteCounts[team.id] || 0}`;
  count.style.marginTop = "8px";
  count.style.color = "#334155";

  card.appendChild(title);
  card.appendChild(count);
  card.appendChild(buildOverallButton(team));

  return card;
}

function buildOverallButton(team) {
  const isMyOverallTeam = myOverallVoteTeamId === team.id;
  const button = document.createElement("button");

  if (isMyOverallTeam) {
    button.textContent = "Your Best Overall Pick";
    button.disabled = true;
    button.style.background = "#2563eb";
  } else if (myOverallVoteTeamId) {
    button.textContent = "Best Overall Vote Already Used";
    button.disabled = true;
    button.style.background = "#94a3b8";
  } else {
    button.textContent = "Vote Best Overall";
    button.style.background = "#0f172a";
    button.addEventListener("click", () => voteOverall(team.id, button));
  }

  button.style.width = "100%";
  button.style.padding = "12px";
  button.style.marginTop = "12px";
  button.style.border = "none";
  button.style.borderRadius = "12px";
  button.style.color = "white";
  button.style.fontWeight = "700";
  button.style.cursor = button.disabled ? "not-allowed" : "pointer";

  return button;
}

async function voteCategory(teamId, category, button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Submitting...";
  try {
    if (myCategoryVotes[category]) {
      setStatus("You already voted in that category.", true);
      renderPage();
      return;
    }

    const { error } = await supabaseClient
      .from("category_votes")
      .insert([{ team_id: teamId, category, voter_id: voterId }]);

    if (error) throw error;

    const key = getCategoryKey(teamId, category);
    categoryVoteCounts[key] = (categoryVoteCounts[key] || 0) + 1;
    myCategoryVotes[category] = teamId;

    renderPage();
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
    if (myOverallVoteTeamId) {
      setStatus("You already used your Best Overall vote.", true);
      renderPage();
      return;
    }

    const { error } = await supabaseClient
      .from("overall_votes")
      .insert([{ team_id: teamId, voter_id: voterId }]);

    if (error) throw error;

    overallVoteCounts[teamId] = (overallVoteCounts[teamId] || 0) + 1;
    myOverallVoteTeamId = teamId;

    renderPage();
    setStatus("Best Overall vote submitted.");
  } catch (error) {
    console.error("Overall vote failed:", error);
    setStatus("Overall vote failed.", true);
    button.disabled = false;
    button.textContent = originalText;
  }
}
