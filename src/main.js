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
               <button class="update-btn" data-id="${book._id}">
                  <span class="symbol material-symbols-outlined">change_circle</span>
               </button>
               <button class="delete-btn" data-id="${book._id}">
                  <span class="symbol material-symbols-outlined">delete</span>
               </button>
            </div>
        </td>
        `;

            bookTableBody.appendChild(tr);
        });

        document.querySelectorAll(".update-btn").forEach(btn => {
            btn.addEventListener("click", updateBook);
        });

        /*document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteBook);
        });*/
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

    async function updateBook(e) {
        const id = e.target.closest("button").dataset.id;
        console.log("ID: ", id);

        const res = await fetch(`http://localhost:5000/books/${id}`);
        const book = await res.json();

        const newTitle = prompt("Ny titel: ", book.title);
        const newPublication = Number(prompt("Nytt utgivningsår: ", book.publication));
        const newRead = prompt("Har du läst den? (ja/nej)").toLowerCase() === "ja";

        const updatedBook = {
            title: newTitle,
            publication: newPublication,
            read: newRead
        };

        console.log("Ska skickas: ", updatedBook);

        /*try {*/
        const resPut = await fetch(`http://localhost:5000/books/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBook)
        });

        if (!res.ok) throw new Error("Boken kunde inte uppdateras");

        /*fetchBooks();
    } catch (err) {
        console.error(err);
    }*/

        console.log("PUT Status: ", resPut.status);
        const data = await resPut.json().catch(err => console.log("Ingen JSON:", err));
        console.log("Respons från servern:", data);
    }

    // laddar böcker
    fetchBooks();
});