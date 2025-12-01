"use strict";

const bookForm = document.getElementById("bookForm");
const bookTableBody = document.querySelector("#bookTable tbody");
const books = [];

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const read = document.getElementById("read").value;

    const book = { title, year, read };
    books.push(book);

    renderTable();
    bookForm.reset();
});

function renderTable() {
    bookTableBody.innerHTML = "";
    const tr = document.createElement("tr");
    
    books.forEach(book => {
        tr.innerHTML = `
        <td>${book.title}</td>
        <td>${book.year}</td>
        <td>${book.read ? 'Ja' : 'Nej'}</td>
        `;

        bookTableBody.appendChild(tr);
    });
}