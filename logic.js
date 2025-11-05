// logic.js
// Menangani semua logika CRUD dan validasi input (modular Firebase SDK)
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const nilaiRef = collection(db, "nilai");

// ====================
// 1️⃣ Validasi Input
// ====================
function validasiInput(nama, nim, matkul, nilai) {
  if (!nama || !nim || !matkul || (nilai === "" || nilai === null || typeof nilai === "undefined")) {
    alert("❌ Semua field wajib diisi!");
    return false;
  }
  if (isNaN(nilai) || nilai < 0 || nilai > 100) {
    alert("❌ Nilai harus angka 0–100!");
    return false;
  }
  if (!/^[0-9]+$/.test(nim)) {
    alert("❌ NIM harus angka!");
    return false;
  }
  return true;
}

// ====================
// 2️⃣ Simpan Data (Create / Update)
// ====================
async function simpanData(id = null, nama, nim, matkul, nilai) {
  try {
    if (id) {
      const docRef = doc(db, "nilai", id);
      await updateDoc(docRef, { nama, nim, matkul, nilai: Number(nilai) });
      alert("✅ Data berhasil diperbarui!");
    } else {
      await addDoc(nilaiRef, { nama, nim, matkul, nilai: Number(nilai) });
      alert("✅ Data baru berhasil disimpan!");
    }

    document.getElementById("nilaiForm").reset();
    const idInput = document.getElementById("idData");
    if (idInput) idInput.value = "";
    loadData();
  } catch (error) {
    console.error("❌ Gagal menyimpan data:", error);
    alert("Terjadi kesalahan saat menyimpan data.");
  }
}

// ====================
// 3️⃣ Tampilkan Data (Read)
// ====================
async function loadData() {
  const tabel = document.getElementById("tabelData") || document.querySelector("#tabelNilai tbody");
  if (!tabel) return;
  tabel.innerHTML = "";

  try {
    const querySnapshot = await getDocs(nilaiRef);
    querySnapshot.forEach((docItem) => {
      const data = docItem.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.nama}</td>
        <td>${data.nim}</td>
        <td>${data.matkul}</td>
        <td>${data.nilai}</td>
        <td>
          <button class="editBtn" data-id="${docItem.id}">Edit</button>
          <button class="deleteBtn" data-id="${docItem.id}">Hapus</button>
        </td>
      `;
      tabel.appendChild(row);
    });

    // Tambahkan event listener ke tombol edit dan hapus
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", () => editData(btn.dataset.id));
    });

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", () => hapusData(btn.dataset.id));
    });
  } catch (error) {
    console.error("Gagal memuat data:", error);
    if (tabel) tabel.innerHTML = `<tr><td colspan="5">Gagal memuat data!</td></tr>`;
  }
}

// ====================
// 4️⃣ Edit Data (Update Form)
// ====================
async function editData(id) {
  try {
    // ambil dokumen spesifik
    const querySnapshot = await getDocs(nilaiRef);
    const docItem = querySnapshot.docs.find((d) => d.id === id);
    if (!docItem) {
      alert("Data tidak ditemukan untuk diedit.");
      return;
    }
    const data = docItem.data();

    document.getElementById("nama").value = data.nama;
    document.getElementById("nim").value = data.nim;
    document.getElementById("matkul").value = data.matkul;
    document.getElementById("nilai").value = data.nilai;
    const idInput = document.getElementById("idData");
    if (idInput) idInput.value = id;
  } catch (error) {
    console.error("Gagal memuat data untuk edit:", error);
  }
}

// ====================
// 5️⃣ Hapus Data (Delete)
// ====================
async function hapusData(id) {
  if (!confirm("Yakin ingin menghapus data ini?")) return;
  try {
    const docRef = doc(db, "nilai", id);
    await deleteDoc(docRef);
    alert("🗑️ Data berhasil dihapus!");
    loadData();
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    alert("Terjadi kesalahan saat menghapus data.");
  }
}

// ====================
// 6️⃣ Jalankan Saat Form Disubmit
// ====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nilaiForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("idData") ? document.getElementById("idData").value : "";
      const nama = document.getElementById("nama").value.trim();
      const nim = document.getElementById("nim").value.trim();
      const matkul = document.getElementById("matkul").value.trim();
      const nilai = document.getElementById("nilai").value.trim();

      const valid = validasiInput(nama, nim, matkul, nilai);
      if (valid) {
        await simpanData(id || null, nama, nim, matkul, nilai);
      } else {
        alert("❌ Simpan data gagal! Periksa input Anda.");
      }
    });
  }

  // jalankan loadData di awal
  loadData();
});
