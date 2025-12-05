"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookTableBody = document.querySelector("#bookTable tbody");

    // hämtar böcker när siddan laddas
    async function fetchBooks() {
        try {
            const res = await fetch("http://localhost:5000/books");
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
            const res = await fetch("http://localhost:5000/books", {
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

    async function updateBook(e) {
        try {
            const btn = e.target.closest("button");
            const id = btn.dataset.id;

            if (!id) return alert("Fel: ID kunde inte hämtas");

            // hämta aktuell bok
            const res = await fetch(`http://localhost:5000/books/${id}`);
            if (!res.ok) throw new Error("Boken kunde inte hämtas");
            const book = await res.json();

            // prompt för nya värden
            const newTitle = prompt("Ny titel: ", book.title);
            if (!newTitle) return;

            const newPublication = Number(prompt("Nytt utgivningsår: ", book.publication));
            if (isNaN(newPublication)) return;

            const newRead = prompt("Har du läst den? (ja/nej)").toLowerCase() === "ja";

            const updatedBook = { title: newTitle, publication: newPublication, read: newRead };

            // skicka PUT
            const resPut = await fetch(`http://localhost:5000/books/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook)
            });

            if (!resPut.ok) throw new Error("Boken kunde inte uppdateras");

            fetchBooks();
        } catch (err) {
            console.error("Fel vid uppdatering:", err);
            alert(err.message);
        }
    }

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

    }

    async function saveInlineForm(id, container) {

    }

    function showErrors() {

    }

    function clearErrors() {

    }

    // laddar böcker
    fetchBooks();
});