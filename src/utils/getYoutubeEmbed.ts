export function getYoutubeEmbedFromUrl(url: string) {
	const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

	const match = url.match(regExp);

	if (match && match[2].length === 11) {
		return `https://www.youtube.com/embed/${match[2]}`;
	}
	console.log('The supplied URL is not a valid youtube URL');

	return '';
}
