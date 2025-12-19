/*API routes till webbtjänst, med Koa Router, via controller-funktioner*/ 

"use strict";

const Router = require("@koa/router");
const router = new Router();
const controller = require("../controllers/bookController");

router.get("/books", controller.getAllBooks);
router.get("/books/:id", controller.getBookById);
router.post("/books", controller.createBook);
router.put("/books/:id", controller.updateBook);
router.delete("/books/:id", controller.deleteBook);

module.exports = router;