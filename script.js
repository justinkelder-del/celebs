(function () {
  const SUPABASE_URL = "https://izgdeuonjjnzaikcmqkb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Z2RldW9uamp6bmFpa2NtcWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjA3MjYsImV4cCI6MjA4OTMzNjcyNn0.bcj1JdyVeOk_RNmiG0jWZ08JtWpWV3v42ZK2ngaaspc";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const teams = [
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

  const teamIds = teams.map(t => t.id);
  const categories = teams[0].roster.map(p => p.category);

  let revealResults = false;
  let overallCounts = blankTeamCounts();
  let categoryCounts = blankCategoryCounts();
  let myOverallVote = null;
  let myCategoryVotes = {};

  function $(id) {
    return document.getElementById(id);
  }

  function showError(message) {
    const banner = $("errorBanner");
    banner.style.display = "block";
    banner.textContent = message;
  }

  function clearError() {
    const banner = $("errorBanner");
    banner.style.display = "none";
    banner.textContent = "";
  }

  function blankTeamCounts() {
    return { "team-1": 0, "team-2": 0, "team-3": 0 };
  }

  function blankCategoryCounts() {
    const obj = {};
    categories.forEach(category => {
      obj[category] = blankTeamCounts();
    });
    return obj;
  }

  function getOrCreateVoterId() {
    let voterId = localStorage.getItem("celebs_voter_id");
    if (!voterId) {
      voterId = crypto.randomUUID();
      localStorage.setItem("celebs_voter_id", voterId);
    }
    return voterId;
  }

  const voterId = getOrCreateVoterId();

  function sumTeamVotes(obj) {
    return Object.values(obj).reduce((a, b) => a + b, 0);
  }

  function percent(count, total) {
    return total ? Math.round((count / total) * 100) : 0;
  }

  function leadingTeam(counts) {
    let best = teamIds[0];
    teamIds.forEach(id => {
      if (counts[id] > counts[best]) best = id;
    });
    return best;
  }

  async function loadSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("reveal_results")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error(error);
      showError("Could not load site settings. Check that the site_settings table exists.");
      return;
    }

    revealResults = !!(data && data.reveal_results);
  }

  async function toggleRevealResults() {
    clearError();
    const { error } = await supabase
      .from("site_settings")
      .update({ reveal_results: !revealResults, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (error) {
      console.error(error);
      showError("Could not update results reveal. Check the site_settings table and policies.");
    }
  }

  async function loadVotes() {
    clearError();
    overallCounts = blankTeamCounts();
    categoryCounts = blankCategoryCounts();
    myOverallVote = null;
    myCategoryVotes = {};

    await loadSettings();

    const overallResp = await supabase
      .from("overall_votes")
      .select("team_id, voter_id");

    if (overallResp.error) {
      console.error(overallResp.error);
      showError("Could not load overall votes. Check that overall_votes exists and has read access.");
    } else {
      (overallResp.data || []).forEach(row => {
        if (overallCounts[row.team_id] !== undefined) overallCounts[row.team_id] += 1;
        if (row.voter_id === voterId) myOverallVote = row.team_id;
      });
    }

    const categoryResp = await supabase
      .from("category_votes")
      .select("category, team_id, voter_id");

    if (categoryResp.error) {
      console.error(categoryResp.error);
      showError("Could not load category votes. Check that category_votes exists and has read access.");
    } else {
      (categoryResp.data || []).forEach(row => {
        if (categoryCounts[row.category] && categoryCounts[row.category][row.team_id] !== undefined) {
          categoryCounts[row.category][row.team_id] += 1;
        }
        if (row.voter_id === voterId) myCategoryVotes[row.category] = row.team_id;
      });
    }

    renderAll();
  }

  async function voteOverall(teamId) {
    clearError();
    const payload = { voter_id: voterId, team_id: teamId };

    const { error } = await supabase
      .from("overall_votes")
      .upsert(payload, { onConflict: "voter_id" });

    if (error) {
      console.error(error);
      showError("Overall vote failed. Check that overall_votes has voter_id and a unique index on voter_id.");
    }
  }

  async function voteCategory(category, teamId) {
    clearError();
    const payload = { voter_id: voterId, category, team_id: teamId };

    const { error } = await supabase
      .from("category_votes")
      .upsert(payload, { onConflict: "category,voter_id" });

    if (error) {
      console.error(error);
      showError("Category vote failed. Check that category_votes has voter_id and a unique index on (category, voter_id).");
    }
  }

  function renderPills() {
    $("overallTotalPill").textContent = `${sumTeamVotes(overallCounts)} overall votes`;
    const allCategoryVotes = categories.reduce((sum, category) => sum + sumTeamVotes(categoryCounts[category]), 0);
    $("categoryTotalPill").textContent = `${allCategoryVotes} category votes`;
    $("resultsStatusPill").textContent = revealResults ? "Results revealed" : "Results hidden";
  }

  function renderLeaderboard() {
    const total = sumTeamVotes(overallCounts);
    const leaderboard = $("leaderboard");
    leaderboard.innerHTML = "";

    const sorted = [...teams].sort((a, b) => overallCounts[b.id] - overallCounts[a.id]);

    sorted.forEach(team => {
      const count = overallCounts[team.id];
      const pct = percent(count, total);

      const card = document.createElement("div");
      card.className = "leader-card";
      card.innerHTML = `
        <h3>${team.name}</h3>
        <div class="leader-stat">${count} overall votes • ${pct}%</div>
        <div class="progress">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
      `;
      leaderboard.appendChild(card);
    });
  }

  function renderVotingView() {
    const galleryGrid = $("galleryGrid");
    galleryGrid.innerHTML = "";

    teams.forEach(team => {
      const teamDiv = document.createElement("div");
      teamDiv.className = "team";

      const overallTotal = sumTeamVotes(overallCounts);
      const overallVotes = overallCounts[team.id];
      const overallPct = percent(overallVotes, overallTotal);

      teamDiv.innerHTML += `<h2>${team.name}</h2>`;
      teamDiv.innerHTML += `<p class="team-sub">Anonymous celebrity draft roster.</p>`;
      teamDiv.innerHTML += `
        <div class="vote-box">
          <div class="vote-title">Best Overall Team</div>
          <div class="small">${overallVotes} votes • ${overallPct}%</div>
          <button class="vote-btn" data-overall-team="${team.id}">
            ${myOverallVote === team.id ? "Your overall vote" : "Vote best overall"}
          </button>
        </div>
      `;

      team.roster.forEach(player => {
        const catVotes = categoryCounts[player.category][team.id];
        const catTotal = sumTeamVotes(categoryCounts[player.category]);
        const catPct = percent(catVotes, catTotal);
        const votedHere = myCategoryVotes[player.category] === team.id;
        const safeCategory = encodeURIComponent(player.category);

        teamDiv.innerHTML += `
          <div class="card">
            <div class="category">${player.category}</div>
            <img src="${player.image}" alt="${player.celeb}">
            <div class="info">
              <div class="celeb-name">${player.celeb}</div>
              <div class="small">Peak year: ${player.year}</div>
              <div class="small" style="margin-top:10px;">${catVotes} category votes • ${catPct}%</div>
              <button class="vote-btn secondary-dark" data-category="${safeCategory}" data-team="${team.id}">
                ${votedHere ? "Your vote in this category" : "Vote this category"}
              </button>
            </div>
          </div>
        `;
      });

      galleryGrid.appendChild(teamDiv);
    });

    galleryGrid.querySelectorAll("[data-overall-team]").forEach(btn => {
      btn.addEventListener("click", () => voteOverall(btn.dataset.overallTeam));
    });

    galleryGrid.querySelectorAll("[data-category]").forEach(btn => {
      btn.addEventListener("click", () => {
        voteCategory(decodeURIComponent(btn.dataset.category), btn.dataset.team);
      });
    });
  }

  function renderResultsView() {
    const overallLeaderId = leadingTeam(overallCounts);
    const overallLeader = teams.find(t => t.id === overallLeaderId);
    const overallTotal = sumTeamVotes(overallCounts);

    $("overallWinnerBanner").innerHTML = revealResults
      ? `<strong>Overall winner:</strong> ${overallLeader.name} with ${overallCounts[overallLeaderId]} votes (${percent(overallCounts[overallLeaderId], overallTotal)}%)`
      : `<strong>Results mode is locked.</strong> Toggle reveal when you are ready to show winners.`;

    const resultsOverallGrid = $("resultsOverallGrid");
    resultsOverallGrid.innerHTML = "";

    [...teams]
      .sort((a, b) => overallCounts[b.id] - overallCounts[a.id])
      .forEach(team => {
        const count = overallCounts[team.id];
        const pct = percent(count, overallTotal);
        const el = document.createElement("div");
        el.className = "leader-card";
        el.innerHTML = `
          <h3>${team.name}</h3>
          <div class="leader-stat">${count} overall votes • ${pct}%</div>
          <div class="progress">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
        `;
        resultsOverallGrid.appendChild(el);
      });

    const categoryResultsGrid = $("categoryResultsGrid");
    categoryResultsGrid.innerHTML = "";

    categories.forEach(category => {
      const leadId = leadingTeam(categoryCounts[category]);
      const leadTeam = teams.find(t => t.id === leadId);
      const total = sumTeamVotes(categoryCounts[category]);

      const row = document.createElement("div");
      row.className = "cat-row";
      row.innerHTML = `
        <div class="cat-row-title">${category}</div>
        <div class="small" style="margin-bottom:10px;">
          ${revealResults
            ? `Winner: ${leadTeam.name} with ${categoryCounts[category][leadId]} votes (${percent(categoryCounts[category][leadId], total)}%)`
            : `Results hidden`}
        </div>
        ${teams.map(team => `
          <div class="small" style="margin:4px 0;">
            ${team.name}: ${categoryCounts[category][team.id]} votes (${percent(categoryCounts[category][team.id], total)}%)
          </div>
        `).join("")}
      `;
      categoryResultsGrid.appendChild(row);
    });
  }

  function renderAll() {
    renderPills();
    renderLeaderboard();
    renderVotingView();
    renderResultsView();
  }

  function showVotingView() {
    $("leaderboard").classList.remove("hidden");
    $("galleryGrid").classList.remove("hidden");
    $("resultsMode").style.display = "none";
  }

  function showResultsView() {
    $("leaderboard").classList.add("hidden");
    $("galleryGrid").classList.add("hidden");
    $("resultsMode").style.display = "block";
  }

  function subscribe() {
    supabase.channel("live-votes")
      .on("postgres_changes", { event: "*", schema: "public", table: "overall_votes" }, () => loadVotes())
      .on("postgres_changes", { event: "*", schema: "public", table: "category_votes" }, () => loadVotes())
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => loadVotes())
      .subscribe();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("showVotingBtn").addEventListener("click", showVotingView);
    $("showResultsBtn").addEventListener("click", showResultsView);
    $("toggleRevealBtn").addEventListener("click", toggleRevealResults);

    renderAll();
    loadVotes();
    subscribe(); 
    showVotingView();
  });
})();
