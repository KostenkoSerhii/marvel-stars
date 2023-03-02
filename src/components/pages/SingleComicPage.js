import {useParams, Link} from 'react-router-dom';

import {useState, useEffect } from "react"

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './singleComicPage.scss';

const SingleComicPage = () => {
	const {comicId} = useParams();
	const [comic, setComic] = useState(null);

	const {loading, error, getComic, clearError} = useMarvelService();


	useEffect(() => {
		updateComic()
	}, [comicId])

	const updateComic = () => {
		clearError();
    getComic(comicId)
      .then(onComicLoaded)
  }

  const onComicLoaded = (comic) => {
		console.log(comic)
		setComic(comic);
  }; 
	
	const errorMessage = error ? <ErrorMessage /> : null;
	const load = loading ? <Spinner /> : null;
	const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

	return (
		<>
			{errorMessage}
			{load}
			{content}
		</>
	)
}

const View = ({comic}) => {
	const {name, description, thumbnail} = comic;
	return (
		<div className="single-comic">
			<img src={thumbnail} alt="x-men" className="single-comic__img"/>
			<div className="single-comic__info">
					<h2 className="single-comic__name">{name}</h2>
					<p className="single-comic__descr">{description}</p>
			</div>
			<link to={'..'} className="single-comic__back">Back to all</link>
	</div>
	)
}

export default SingleComicPage;