export default {
	path: '/',
	run: async (req, res) => {
		res.status(200).send("The maze wasn't meant for you.");
	},
};
