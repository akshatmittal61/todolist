import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();
app.set("view engine", "ejs");
const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoListDB");

let itemsToSend = [];
let allRoutes = [];
let routes = [];

const itemsSchema = new mongoose.Schema({
	title: String,
	category: String,
});
const Item = new mongoose.model("Item", itemsSchema);
Item.find({}, (err, data) => {
	if (err) console.log(err);
	else {
		data.forEach((item) => {
			allRoutes = [...allRoutes, item.category];
		});
		routes = [...new Set(allRoutes)];
		console.log(routes);
	}
});
let today = new Date();
let options = {
	weekday: "long",
	day: "numeric",
	month: "long",
};
let day = today.toLocaleDateString("en-US", options);

app.get("/", (req, res) => {
	itemsToSend = [];
	Item.find({}, (err, data) => {
		if (err) console.log(err);
		else {
			data.forEach((item) => {
				if (item.category === `/`) itemsToSend = [...itemsToSend, item];
			});
			console.log(data);
			console.log(itemsToSend);
			res.render("list", {
				title: day,
				items: itemsToSend,
				route: "/",
				allRoutes: routes,
			});
		}
	});
});
app.post("/", (req, res) => {
	console.log(req.body);
	const itemTitle = req.body.item;
	const newItem = new Item({
		title: itemTitle,
		category: "/",
	});
	newItem.save();
	itemsToSend = [...itemsToSend, req.body.item];
	res.redirect("/");
});
app.get("/about", (req, res) => {
	res.render("about");
});

app.post("/delete", (req, res) => {
	const checkId = req.body.checked;
	let itemToDel = {};
	Item.findById(checkId, (err, item) => {
		if (err) console.log(err);
		else {
			console.log(item);
			itemToDel = { ...item._doc };
		}
	});
	Item.findByIdAndDelete(checkId, (err) => {
		if (err) console.log(err);
		else
			console.log({
				status: 200,
				message: `Suuccessfully deleted item with id: ${checkId}`,
			});
		console.log(itemToDel);
		res.redirect(itemToDel.category);
	});
});

app.listen(5000, () => {
	console.log("Server is running at port 5000");
});
