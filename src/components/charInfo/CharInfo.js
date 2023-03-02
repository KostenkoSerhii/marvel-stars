import {useState, useEffect } from "react"
import PropTypes from 'prop-types';

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

const CharInfo  = (props) => {
	const [char, setChar] = useState(null);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);


  const marvelService = new MarvelService();
	
	useEffect(() => {
		updateChar()
	}, [props.charId])

	const updateChar = () => {
    const { charId } = props;
    if (!charId) return;

  	onCharLoading();

    marvelService
      .getCharacter(charId)
      .then(onCharLoaded)
      .catch(onError);
  }

  const onCharLoaded = (char) => {
		setChar(char);
		setLoading(false)
  };

  const onCharLoading = () => {
		setLoading(true);
		setError(false);
  };

 const onError = () => {
	 setError(true);
  };


	const skeleton = char || loading || error ? null : <Skeleton />;
	const errorMessage = error ? <ErrorMessage /> : null;
	const load = loading ? <Spinner /> : null;
	const content = !(loading || error || !char) ? <View char={char} /> : null;

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{load}
			{content}
		</div>
	);
}

CharInfo.propTypes = {
  charId: PropTypes.number
};


export default CharInfo;

const View = (props) => {
  const { name, description, thumbnail, homepage, wiki, comics, imageExist } =
    props.char;
  const imgStylesFit = imageExist ? "cover" : "fill";

	const comicsList = [...comics];
	const listIsNotEmpty = comicsList.length > 0;
	if(listIsNotEmpty) comicsList.length = 10;

  return (
    <>
      <div className="char__basics">
        <img style={{ objectFit: imgStylesFit }} src={thumbnail} alt="alt" />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>


		{ listIsNotEmpty && (
			<>
				<div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
          {comicsList.map((item, i) => {
            return (
              <li className="char__comics-item" key={i}>
                {item.name}
              </li>
            );
          })}
        </ul>
			</>

		)}
    </>
  );
};
