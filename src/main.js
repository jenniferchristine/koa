"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookTableBody = document.querySelector("#bookTable tbody");
    const API_URL = "http://localhost:5000/books";

    // hämtar böcker när siddan laddas
    async function fetchBooks() {
        try {
            const res = await fetch(API_URL);
            const books = await res.json();
            renderTable(books);
        } catch (err) {
            console.error("Resultatet kunde inte hämtas: ", err);
        }
    }

    // renderar tabellen
    function renderTable(books) {
        bookTableBody.innerHTML = "";

        books.forEach(book => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${book.title}</td>
        <td>${book.publication}</td>
        <td>${book.read ? 'Ja' : 'Nej'}</td>
        <td>
            <div class="btn-container">
               <button class="update-btn material-symbols-outlined" data-id="${book._id}">
                  change_circle
               </button>
               <div class="inline-edit-container" style="display:none";></div>
               <button class="delete-btn material-symbols-outlined" data-id="${book._id}">
                  delete
               </button>
            </div>
        </td>
        `;
            bookTableBody.appendChild(tr);
        });

        document.querySelectorAll(".update-btn").forEach(btn => {
            btn.addEventListener("click", showInlineForm(btn));
        });

        /*document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteBook);
        });*/
    }

    // skapar ny bok
    bookForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const publication = Number(document.getElementById("publication").value);
        const read = document.getElementById("read").checked;

        const newBook = { title, publication, read };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBook)
            });

            if (!res.ok) throw new Error("Boken kunde inte läggas till");
            fetchBooks();

            bookForm.reset();
        } catch (err) {
            console.error(err);
        }
    });

    async function showInlineForm(btn) {
        const tr = btn.closest("tr");
        const container = tr.querySelector(".inline-edit-container");
        const id = btn.dataset.id;

        if (container.style.display === "block") {
            container.style.display = "none";
            container.innerHTML = "";
            return;
        }

        const book = await fetchBook(id);
        if (!book) return;

        container.innerHTML = createInlineForm(book);
        container.style.display = "block";

        container.querySelector(".save-inline-btn").addEventListener("click", () => saveInlineForm(id, container));
        container.querySelector(".cancel-inline-btn").addEventListener("click", () => {
            container.style.display = "none";
            container.innerHTML = "";
        });
    }

    function createInlineForm(book) {
        return `
        <input type="text" name="title" value="${book.title}" placeholder="Titel">
        <div class="error-title"></div>
        <input type="number" name="publication" value="${book.publication}" placeholder="Utgivningsår">
        <div class="error-publication"></div>
        <label><input type="checkbox" name="read" ${book.read ? "checked" : ""}>Läst</label>
        <button class="save-inline-btn">Spara</button>
        <button class="cancel-inline-btn">Avbryt</button>
        `;
    }

    async function saveInlineForm(id, container) {
        const newTitle = container.querySelector('input[name="title"]').value.trim();
        const newPublication = container.querySelector('input[name="publication"]').value.trim();
        const newRead = container.querySelector('input[name="read"]').checked;

        try {
            const res = await fetch(`http://localhost:5000/books/${id}`, {
                method
            });
        }
    }

    function showErrors() {

    }

    function clearErrors() {

    }

    // laddar böcker
    fetchBooks();
});