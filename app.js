// =========================================================
// LOGIKA APLIKASI UTAMA (khusus index.html)
// Membutuhkan: firebase-config.js & auth.js
// =========================================================

function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

// ---------- Elemen DOM ----------
const userMenu = document.getElementById("userMenu");
const mainAppSection = document.getElementById("mainAppSection");
const connStatus = document.getElementById("connStatus");

const form = document.getElementById("kaosForm");
const kaosIdInput = document.getElementById("kaosId");
const namaInput = document.getElementById("namaKaos");
const ukuranInput = document.getElementById("ukuran");
const warnaInput = document.getElementById("warna");
const hargaInput = document.getElementById("harga");
const stokInput = document.getElementById("stok");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const tableBody = document.getElementById("kaosTableBody");
const totalCount = document.getElementById("totalCount");

// ---------- Status Koneksi DB Realtime ----------
db.ref(".info/connected").on("value", (snap) => {
  if (snap.val() === true) {
    connStatus.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> terhubung';
  } else {
    connStatus.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> terputus';
  }
});

// ---------- Tampilkan / sembunyikan UI sesuai status login ----------
// (redirect ke login.html sudah ditangani di auth.js)
auth.onAuthStateChanged((user) => {
  if (user) {
    mainAppSection.classList.remove("d-none");
    userMenu.classList.remove("d-none");
    userMenu.classList.add("d-flex");
    document.getElementById("userEmailDisplay").textContent = user.email;
    startDatabaseListener(); // Mulai tarik data
  } else {
    mainAppSection.classList.add("d-none");
    userMenu.classList.remove("d-flex");
    userMenu.classList.add("d-none");
    kaosRef.off(); // Putuskan listener agar data tidak dibaca bocor
  }
});

// =========================================================
// CRUD KAOS
// =========================================================

// CREATE & UPDATE
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nama: namaInput.value.trim(),
    ukuran: ukuranInput.value,
    warna: warnaInput.value.trim(),
    harga: Number(hargaInput.value),
    stok: Number(stokInput.value),
  };

  const editId = kaosIdInput.value;

  if (editId) {
    kaosRef.child(editId).update(data)
      .then(() => {
        showToast("Data kaos berhasil diperbarui.");
        resetForm();
      })
      .catch((err) => showToast("Gagal update: " + err.message, "error"));
  } else {
    kaosRef.push(data)
      .then(() => {
        showToast("Kaos baru berhasil ditambahkan.");
        resetForm();
      })
      .catch((err) => showToast("Gagal menambah: " + err.message, "error"));
  }
});

function resetForm() {
  form.reset();
  kaosIdInput.value = "";
  formTitle.textContent = "Tambah Kaos Baru";
  submitBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Simpan';
  cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

// READ (dipanggil ketika sudah login)
function startDatabaseListener() {
  kaosRef.on("value", (snapshot) => {
    const items = snapshot.val();
    tableBody.innerHTML = "";

    if (!items) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Belum ada data kaos.</td></tr>`;
      totalCount.textContent = "0 item";
      return;
    }

    const keys = Object.keys(items);
    totalCount.textContent = `${keys.length} item`;

    keys.forEach((id) => {
      const item = items[id];
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nama ?? "-"}</td>
        <td><span class="badge bg-secondary">${item.ukuran ?? "-"}</span></td>
        <td>${item.warna ?? "-"}</td>
        <td class="badge-harga">${formatRupiah(item.harga ?? 0)}</td>
        <td>${item.stok ?? 0} pcs</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary action-btn edit-btn" data-id="${id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger action-btn delete-btn" data-id="${id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    attachRowEvents(items);
  });
}

function attachRowEvents(items) {
  // Tombol edit
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = items[id];

      kaosIdInput.value = id;
      namaInput.value = item.nama ?? "";
      ukuranInput.value = item.ukuran ?? "";
      warnaInput.value = item.warna ?? "";
      hargaInput.value = item.harga ?? "";
      stokInput.value = item.stok ?? "";

      formTitle.textContent = "Edit Kaos";
      submitBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Update';
      cancelEditBtn.style.display = "inline-block";

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Tombol delete (langsung hapus tanpa confirm)
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      kaosRef.child(id).remove()
        .then(() => showToast("Data kaos berhasil dihapus.", "info"))
        .catch((err) => showToast("Gagal hapus: " + err.message, "error"));
    });
  });
}
