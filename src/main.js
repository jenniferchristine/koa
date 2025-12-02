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
        `;

            bookTableBody.appendChild(tr);
        });
    }

    // skapar ny bok
    bookForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const publication = document.getElementById("publication").value;
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

    // laddar böcker
    fetchBooks();
});