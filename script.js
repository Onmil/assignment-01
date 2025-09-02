document.addEventListener("DOMContentLoaded", function () {const rowsBox = document.getElementById("rowsBox");
const nameOption = document.getElementById("nameOption");

document.getElementById("getUsers").addEventListener("click", () => {
  fetch("sample.json")
    .then(res => res.json())
    .then(data => {
      showUsers(data.results);
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
    let displayName = nameOption.value === "First Name" ? user.name.first : user.name.last;

    row.innerHTML = `
      <div class="col"><div class="header-box">${displayName}</div></div>
      <div class="col"><div class="header-box">${user.gender}</div></div>
      <div class="col"><div class="header-box">${user.email}</div></div>
      <div class="col"><div class="header-box">${user.location.country}</div></div>
    `;
    rowsBox.appendChild(row);
  });
}


