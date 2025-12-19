"use strict";

// körs när domen laddats
document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookTableBody = document.querySelector("#bookTable tbody");
    const API_URL = "https://koa-13bx.onrender.com/books";

    // hämtar böcker när siddan laddas
    async function fetchAllBooks() {
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

        books.forEach(book => { // skapar rad för bok
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

            const inlineWrapper = document.createElement("div");
            inlineWrapper.classList.add("inline-wrapper");
            inlineWrapper.style.display = "none";
            inlineWrapper.innerHTML = `
        <div class="inline-edit-container"></div>
        `;

            bookTableBody.appendChild(tr);
            bookTableBody.appendChild(inlineWrapper);
        });

        // event för uppdatering
        document.querySelectorAll(".update-btn").forEach(btn => {
            btn.addEventListener("click", () => showInlineForm(btn));
        });

        // event för att radera
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteBook);
        });
    }

    // skapar ny bok
    bookForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearErrors(bookForm);

        // samlar in värden från formuläret
        const newBook = {
            title: document.getElementById("title").value,
            publication: Number(document.getElementById("publication").value),
            read: document.getElementById("read").checked
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBook)
            });

            const data = await res.json();

            if (!res.ok) { // visar valideringsfel från backend
                showErrors(bookForm, data.errors);
                return;
            }

            bookForm.reset();
            fetchAllBooks();
        } catch (err) {
            console.error(err);
        }
    });

    // visar inlineformulär
    async function showInlineForm(btn) {
        const tr = btn.closest("tr");
        const wrapper = tr.nextElementSibling;
        const container = wrapper.querySelector(".inline-edit-container");
        const id = btn.dataset.id;

        if (wrapper.style.display === "block") {
            wrapper.style.display = "none";
            container.innerHTML = "";
            return;
        }
        
        // hämtar vald bok
        const book = await fetchBook(id); 
        if (!book) return;

        // skapar formulär
        container.innerHTML = createInlineForm(book);
        wrapper.style.display = "block";

        // sparar uppdatering
        container.querySelector(".save-inline-btn").addEventListener("click", () => saveInlineForm(id, container));
        // avbryter
        container.querySelector(".cancel-inline-btn").addEventListener("click", () => {
            wrapper.style.display = "none";
            container.innerHTML = "";
        });
    }

    // skapar inlineformulär
    function createInlineForm(book) {
        return `
        <input type="text" name="title" value="${book.title}" placeholder="Titel">
        <div class="error error-title"></div>

        <input type="number" name="publication" value="${book.publication}" placeholder="Utgivningsår">
        <div class="error error-publication"></div>

        <label><input type="checkbox" name="read" ${book.read ? "checked" : ""}>Läst</label>

        <button class="save-inline-btn">Spara</button>
        <button class="cancel-inline-btn">Avbryt</button>
        `;
    }

    // sparar uppdaterad bok
    async function saveInlineForm(id, container) {
        clearErrors(container);

        const updatedBook = {
            title: container.querySelector('input[name="title"]').value.trim(),
            publication: container.querySelector('input[name="publication"]').value.trim(),
            read: container.querySelector('input[name="read"]').checked
        };

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook)
            });

            const data = await res.json();

            if (!res.ok) {
                showErrors(container, data.errors);
                return;
            }

            fetchAllBooks();
        } catch (err) {
            console.error("Fel vid uppdatering: ", err);
        }
    }

    // raderar bok
    async function deleteBook(e) {
        const id = e.target.dataset.id;
        if (!confirm("Är du säker på att du vill ta bort denna bok?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Bok kunde inte raderas");
            fetchAllBooks();
        } catch (err) {
            console.error(err);
        }
    }

    // hjälpfunktion för specifik bok
    async function fetchBook(id) {
        const res = await fetch(`${API_URL}/${id}`);
        return res.ok ? res.json() : null;
    }

    // funktion för att visa backend valdering
    function showErrors(container, errors = {}) {
        if (errors.title) {
            container.querySelector(".error-title").textContent = errors.title;
        }
        if (errors.publication) {
            container.querySelector(".error-publication").textContent = errors.publication;
        }
    }

    // funktion för att rensa felmeddelanden
    function clearErrors(container) {
        container.querySelectorAll(".error").forEach(el => el.textContent = "");
    }

    // laddar böcker
    fetchAllBooks();
});