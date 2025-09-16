const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

let cachedUsers = [];

async function fetchUsers(count) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();
  return data.results;
}

app.get("/api", async (req, res) => {
  let count = parseInt(req.query.results) || 1;
  if (count < 1) count = 1;

  if (cachedUsers.length < count) {
    const more = await fetchUsers(count - cachedUsers.length);
    cachedUsers = cachedUsers.concat(more);
  }

  res.json({
    results: cachedUsers.slice(0, count),
    info: {
      seed: "assignment-02",
      results: count,
      version: "1.0"
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
