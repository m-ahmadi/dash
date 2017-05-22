const u = require("util-ma");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/dashboard";
const log = console.log;

const o = {
	find(c, p, cb)   {
		c.find(p).sort({order: 1}).toArray( (e, r) => cb(r) );
	},
	insert(c, p, cb) {
		c.insert( p, (e, r) => cb(r) );
	},
	update(c, q, u, cb) {
		c.update( q, u, (e, r) => cb(r) );
	},
	remove(c, p, cb) {
		c.deleteOne( p, (e, r) => cb(r) );
	}
};
function q(k, par, cb) {
	MongoClient.connect(url, (err, db) => {
		let collection = db.collection("widgets");
		o[k](collection, par, (r) => {
			cb(r);
			db.close();
		});
	});
}

app.get("/widget/fetch", (req, res) => {
	const id = req.query.id;
	let o = {};
	if (id) o.id = id;
	q("find", o, r => res.send(r));
});
app.get("/widget/add", (req, res) => {
	const o = JSON.parse( req.query.widget )
	q("insert", o, r => res.send(r));
});
app.get("/widget/edit", (req, res) => {
	const id = req.query.id;
	delete req.query.id;
	q("remove", {id: id}, req.query, r => res.send(r));
});
app.get("/widget/delete", (req, res) => {
	const id = req.query.id;
	let o = {};
	if (id) o.id = id;
	q("remove", o, r => res.send(r));
});

app.listen(2000, "localhost");