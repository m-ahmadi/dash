const u = require("util-ma");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/dashboard";
const log = console.log;

const o = {
	find(c, p, cb)   {
		c.find(p).toArray( (e, r) => cb(r) );
	},
	insert(c, p, cb) {
		c.insert( p, (e, r) => cb(r) );
	},
	update(c, p, cb) {
		c.update( p, (e, r) => cb(r) );
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

app.get("/widget/fetchAll", (req, res) => {
	q("find", {}, r => res.send(r));
});
app.get("/widget/add", (req, res) => {
	q("insert", req.query, r => res.send(r));
});
app.get("/widget/edit", (req, res) => {
	q("remove", req.query, r => res.send(r));
});
app.get("/widget/delete", (req, res) => {
	q("remove", {id: req.query.id}, r => res.send(r));
});

app.listen(2000, "localhost");