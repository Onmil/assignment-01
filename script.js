document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("getUsers");
  const numBox = document.getElementById("numBox");
  const err = document.getElementById("err");
  const rowsBox = document.getElementById("rowsBox");
  const nameOpt = document.getElementById("nameOpt");

  let allusers = [];

  async function grabUsers(count) {
    try {
      err.classList.add("d-none");
      rowsBox.innerHTML = "<div class='text-center text-muted'>Loading...</div>";
      let resp = await fetch("https://randomuser.me/api/?results=" + count);
      if (!resp.ok) {
        err.innerText = "Error: API response failed.";
        err.classList.remove("d-none");
        rowsBox.innerHTML = "";
        return;
      }
      let info = await resp.json();
      allusers = info.results;
      showUsers();
    } catch (e) {
      err.innerText = "Connection failed. Please check your internet.";
      err.classList.remove("d-none");
      rowsBox.innerHTML = "";
    }
  }

  function showUsers() {
    rowsBox.innerHTML = "";
    for (let i = 0; i < allusers.length; i++) {
      let u = allusers[i];
      let nm = (nameOpt.value === "first") ? u.name.first : u.name.last;
      let r = document.createElement("div");
      r.className = "row text-center border-bottom py-2";
      r.innerHTML = `
        <div class="col">${nm}</div>
        <div class="col">${u.gender}</div>
        <div class="col">${u.email}</div>
        <div class="col">${u.location.country}</div>
      `;
      rowsBox.appendChild(r);
    }
  }

  btn.addEventListener("click", () => {
    let c = parseInt(numBox.value);
    if (isNaN(c) || c < 0 || c > 1000) {
      err.innerText = "Please enter a number between 0 and 1000.";
      err.classList.remove("d-none");
      rowsBox.innerHTML = "";
      return;
    }
    grabUsers(c);
  });

  nameOpt.addEventListener("change", function () {
    showUsers();
  });
});
