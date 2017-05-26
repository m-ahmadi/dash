const u = require("util-ma");
const mysql = require("mysql");
const express = require("express");
const app = express();
const log = console.log;
const db = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "",
	database : "dashboard"
});
db.connect( err => {
	if (err) {
		console.error("error connecting: " + err.stack);
		return;
	}
	console.log("connected as id " + db.threadId);
});
// req.query.id
app.get("/widget/fetchAll", (req, res) => {
	db.query("SELECT * FROM widget;", (error, results, fields) => {
		log( results );
		res.send(results);
	});
});
app.get("/widget/add", (req, res) => {
	let widget = JSON.parse(req.query.widget);
	let cols = Object.keys(widget).join(", ").trim();
	let values = "";
	Object.keys(widget).forEach(k => {
		const p = widget[k];
		let toPush = u.isArr(p) ? "'"+JSON.stringify(p)+"'" :
			u.isStr(p) ? `'${p}'` : p;
		values += `${toPush}, `;
	});
	values = values.slice(0, -2);
	const q = "INSERT INTO widget ("+cols+") VALUES("+values+");";
	log(q);
	db.query(q, (error, results, fields) => {
		log( error );
		res.send(results || error);
	});
	// res.send(req.query); 
});
app.get("/widget/remove", (req, res) => {
	const q = `insert into widget values();`;
	
});
app.listen(2000, "localhost");