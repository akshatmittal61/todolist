import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();
app.set("view engine", "ejs");
const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* let items = [];
let workItems = []; */
app.get("/", (req, res) => {
	let today = new Date();
	let options = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};
	let day = today.toLocaleDateString("en-US", options);
	res.render("list", { title: day, items: items });
});
app.post("/", (req, res) => {
	console.log(req.body);
	if (req.body.button === "Work") {
		workItems = [...workItems, req.body.item];
		res.redirect("/work");
	} else {
		items = [...items, req.body.item];
		res.redirect("/");
	}
});
app.get("/work", (req, res) => {
	res.render("list", { title: "Work", items: workItems });
});
app.post("/work", (req, res) => {
	console.log(req.body);
	workItems = [...items, req.body.item];
	res.redirect("/work");
});
app.get("/about", (req, res) => {
	res.render("about");
});

app.listen(5000, () => {
	console.log("Server is running at port 5000");
});
