"use strict";

const Router = require("@koa/router");
const router = new Router();

router.get("/books");
router.get("/books/:id");
router.post("/book");
router.put("/books/:id");
router.delete("/books/:id");

module.exports = router;