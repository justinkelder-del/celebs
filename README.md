Replace your current index.html with the included index.html and upload script.js to the root of your repo.

Why this version is safer:
- The JavaScript is moved out of inline HTML into script.js
- Vote buttons are wired with event listeners instead of fragile inline onclick strings
- The page renders the team cards immediately, then loads Supabase vote data
- If Supabase has a problem, the teams still render and the error banner will explain what failed
