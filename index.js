// implement your API here

const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

// if body or name is missing, sends correct error message, but still adds it---- how to fix?

server.post('/users', (req, res) => {
	const userData = req.body;
	db
		.insert(userData)
		.then((user) => {
			if (!userData.name || !userData.bio) {
				console.log('missing');
				res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' }).end();
			} else {
				res.status(201).json(user);
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'There was an error while saving the user to the database' });
		});
});

server.get('/users', (req, res) => {
	db
		.find()
		.then((objects) => {
			res.status(200).json(objects);
		})
		.catch((err) => {
			res.status(500).json({ error: 'The users information could not be retrieved.' });
		});
});

server.get('/users/:id', (req, res) => {
	const userId = req.params.id;
	db
		.findById(userId)
		.then((user) => {
			if (!user) {
				console.log('not found');
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			} else {
				res.status(200).json(user);
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error   : err,
				message : 'The user information could not be retrieved.'
			});
		});
});

server.delete('/users/:id', (req, res) => {
	const userId = req.params.id;
	db
		.remove(userId)
		.then((user) => {
			if (!user) {
				console.log('not found');
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			} else {
				res.status(204).end();
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The user could not be removed' });
		});
});

server.put('/users/:id', (req, res) => {
	const userId = req.params.id;
	const userData = req.body;
	db
		.update(userId, userData)
		.then((user) => {
			if (!user) {
				console.log('not found');
				res.status(404).json({ message: 'The user with the specified ID does not exist.' });
			}
			if (!userData.name || !userData.bio) {
				console.log('missing');
				res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' }).end();
			} else {
				res.status(200).json(user);
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The user information could not be modified.' });
		});
});

server.listen(5000, () => {
	console.log('\n*** API running on port 5000 ***\n');
});
