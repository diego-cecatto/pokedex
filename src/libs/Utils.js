import axios from 'axios';
class Utils {

	static sanitize(str) {
		var words = str.split('-');
		str = '';
		for (var word in words) {
			word = words[word];
			str = ' ' + word[0].toUpperCase() + word.substring(1);
		}
		return str.substring(1);
	}

}

Utils.requests = {
	group: function (params) {
		var _groupeds = [];
		for (var group in params.groups) {
			group = params.groups[group];
			_groupeds.push(
				axios.get(group.url)
			);
		}
		axios.all(_groupeds).then(
			axios.spread(
				(...responses) => {
					console.log(responses)
					for (var response in responses) {
						response = responses[response].data;
						params.callbacks.single(response)
					}
					params.callbacks.default(response);
				}
			)
		)
	},
	get: function (params) {
		axios
			.get(params.data.url)
			.then((response) => { params.callback(response.data) });
	}
}

export default Utils;