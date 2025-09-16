document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("getUsers");
  const numBox = document.getElementById("numBox");
  const err = document.getElementById("err");
  const rowsBox = document.getElementById("rowsBox");
  const nameOpt = document.getElementById("nameOpt");

  const modal = new bootstrap.Modal(document.getElementById("userModal"));
  const modalImg = document.getElementById("modalImg");
  const modalName = document.getElementById("modalName");
  const modalFullName = document.getElementById("modalFullName");
  const modalAddress = document.getElementById("modalAddress");
  const modalEmail = document.getElementById("modalEmail");
  const modalPhone = document.getElementById("modalPhone");
  const modalCell = document.getElementById("modalCell");
  const modalDOB = document.getElementById("modalDOB");
  const modalGender = document.getElementById("modalGender");
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  let allusers = [];
  let currentIndex = null;

  async function grabUsers(count) {
    try {
      err.classList.add("d-none");
      rowsBox.innerHTML = "<div class='text-center text-muted'>Loading...</div>";

      let resp = await fetch(`http://localhost:3000/api?results=${count}`);

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
      r.className = "row text-center border-bottom py-2 user-row";
      r.dataset.index = i;
      r.innerHTML = `
        <div class="col">${nm}</div>
        <div class="col">${u.gender}</div>
        <div class="col">${u.email}</div>
        <div class="col">${u.location.country}</div>
      `;
      r.addEventListener("dblclick", () => openModal(i));
      rowsBox.appendChild(r);
    }
  }

  function openModal(index) {
    currentIndex = index;
    let u = allusers[index];
    modalImg.src = u.picture.large;
    modalName.innerText = `${u.name.title} ${u.name.first} ${u.name.last}`;
    modalFullName.value = `${u.name.title} ${u.name.first} ${u.name.last}`;
    modalAddress.value = `${u.location.street.number} ${u.location.street.name}, ${u.location.city}, ${u.location.state}, ${u.location.country}, ${u.location.postcode}`;
    modalEmail.value = u.email;
    modalPhone.value = u.phone;
    modalCell.value = u.cell;
    modalDOB.value = new Date(u.dob.date).toLocaleDateString();
    modalGender.value = u.gender;
    toggleForm(false);
    modal.show();
  }

  function toggleForm(editable) {
    modalFullName.readOnly = !editable;
    modalAddress.readOnly = !editable;
    modalEmail.readOnly = !editable;
    modalPhone.readOnly = !editable;
    modalCell.readOnly = !editable;
    modalDOB.readOnly = !editable;
    modalGender.readOnly = !editable;
    editBtn.classList.toggle("d-none", editable);
    saveBtn.classList.toggle("d-none", !editable);
  }

  editBtn.addEventListener("click", () => {
    toggleForm(true);
  });

  saveBtn.addEventListener("click", () => {
    if (currentIndex !== null) {
      let parts = modalFullName.value.split(" ");
      allusers[currentIndex].name.title = parts[0] || "";
      allusers[currentIndex].name.first = parts[1] || "";
      allusers[currentIndex].name.last = parts.slice(2).join(" ") || "";
      allusers[currentIndex].location.street.name = modalAddress.value;
      allusers[currentIndex].email = modalEmail.value;
      allusers[currentIndex].phone = modalPhone.value;
      allusers[currentIndex].cell = modalCell.value;
      allusers[currentIndex].dob.date = new Date(modalDOB.value).toISOString();
      allusers[currentIndex].gender = modalGender.value;
      showUsers();
      toggleForm(false);
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (currentIndex !== null) {
      allusers.splice(currentIndex, 1);
      showUsers();
      modal.hide();
    }
  });

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
