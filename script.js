document.addEventListener("DOMContentLoaded", function () {
  const rowsBox = document.getElementById("rowsBox");
  const nameOption = document.getElementById("nameOpt");

  document.getElementById("getUsers").addEventListener("click", () => {
    fetch("modifications.json")
      .then(res => res.json())
      .then(data => {
        const num = parseInt(document.getElementById("numBox").value, 10);
        if (isNaN(num) || num <= 0) {
          rowsBox.innerHTML = `<div class="text-danger">Please enter a valid number greater than 0.</div>`;
          return;
        }
        const users = Array(num).fill(data.results[0]);
        showUsers(users);
      })
      .catch(() => {
        rowsBox.innerHTML = `<div class="text-danger">Failed to load sample data.</div>`;
      });
  });

  function showUsers(users) {
    rowsBox.innerHTML = "";
    users.forEach(user => {
      const row = document.createElement("div");
      row.className = "row text-center mb-2";
      let displayName =
        nameOption.value === "first" ? user.name.first : user.name.last;

      row.innerHTML = `
        <div class="col"><div class="header-box">${displayName}</div></div>
        <div class="col"><div class="header-box">${user.gender}</div></div>
        <div class="col"><div class="header-box">${user.email}</div></div>
        <div class="col"><div class="header-box">${user.location.country}</div></div>
      `;
      rowsBox.appendChild(row);
    });
  }
});
