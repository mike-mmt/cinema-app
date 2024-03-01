import axios from 'axios';

export async function fetchScreenings(from: Date, to: Date, movieId: string | undefined = undefined) {
	try {
		const response = await axios.get(process.env.BACKEND_URL + '/screenings', {
			params: {
				from: from.toISOString(),
				to: to.toISOString(),
				...(movieId && { movieId: movieId }),
			},
		});
		//   console.log(new Date(response.data[0].date).toLocaleString());
		return response;
	} catch (error) {
		console.log(error);
	}
}
