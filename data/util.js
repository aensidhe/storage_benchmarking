module.exports = {
	max_record_count : 1e6,
	record_per_iteration : 1e3,
	random_string: function (length) {
	    var result = "";
		var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		
	    for (var i = 0; i < length; i++) {
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		}
	    return result;
	},
	done: function (err) {
		if (err) {
			console.error(err);
		}
		
		console.log("Done");
		process.exit();
	}
}