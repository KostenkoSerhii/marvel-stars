class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=65409babf344c9e4189bb37c6516ad7f';

	getResource = async (url) => {
			let res = await fetch(url);
	
			if (!res.ok) {
					throw new Error(`Could not fetch ${url}, status: ${res.status}`);
			}
	
			return await res.json();
	}

	getAllCharacters = async () => {
			const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
			return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
			const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
			return this._transformCharacter(res.data.results[0]);		
	}

	_transformCharacter = (char) => {
		const imgSrc = char.thumbnail.path + '.' + char.thumbnail.extension;
		const isImageExist = imgSrc.indexOf('image_not_available') === -1;
	
			return {
					id: char.id,
					name: char.name,
					description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
					thumbnail: imgSrc,
					homepage: char.urls[0].url,
					wiki: char.urls[1].url,
					comics: char.comics.items,
					imageExist: isImageExist,
			}
	}
}

export default MarvelService;