import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = (props) => {

	const [chars, setChars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [newItemsloading, setNewItemsloading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();


	useEffect(() => {
		onRequest();
	}, [] )


	const onRequest = offset => {
		onNewCharsLoading();
		marvelService
		.getAllCharacters(offset)
		.then(onCharsLoaded)
		.catch(onError);
	}


  const onCharsLoaded = (newChars) => {
		const ended = newChars.length < 9 ;
    // this.setState(({chars, offset}) => {
		// 	return {
		// 		chars: [...chars, ...newChars],
		// 		loading: false,
		// 		newItemsloading: false,
		// 		offset: offset + 9,
		// 		charEnded: ended
		// 	}
		// });
		setChars(chars => [...chars, ...newChars]);
		setLoading(false);
		setNewItemsloading(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended)
  };

	const onNewCharsLoading = () => {
		setNewItemsloading(true)
	}

  const onError = () => {
		setError(true)
		setLoading(false)
    // this.setState({
    //   error: true,
    //   loading: false,
    // });
  };




	const itemRefs = useRef([]);

	const focusOnItem = i => {
		itemRefs.current.forEach(item => {
			item.classList.remove('char__item_selected')
		});
		itemRefs.current[i].classList.add('char__item_selected');
		itemRefs.current[i].focus();
	}

  const renderItems = (items) => {
    const listItems = items.map(({ name, thumbnail, imageExist, id }, i) => {
      const imgStylesFit = imageExist ? "cover" : "fill";
      return (
        <li
					tabIndex={0}
          className="char__item"
          key={id}
					ref={el => itemRefs.current[i] = el}
          onClick={() => {
						props.onCharSelected(id);
						focusOnItem(i)
					}}
					onKeyPress={(e) => {
						if (e.key === ' ' || e.key === "Enter") {
								props.onCharSelected(id);
								focusOnItem(i);
						}
				}}
        >
          <img
            src={thumbnail}
            style={{ objectFit: imgStylesFit }}
            alt="abyss"
          />
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{listItems}</ul>;
  };

	// const { chars, loading, error,newItemsloading, offset, charEnded } = this.state;
	const errorMessage = error ? <ErrorMessage /> : null;
	const load = loading ? <Spinner /> : null;
	const content = !(loading || error) ? renderItems(chars) : null;

	return (
		<div className="char__list">
			{errorMessage}
			{load}
			{content}
			<button 
				className="button button__main button__long"
				disabled={newItemsloading}
				style={{'display': charEnded ? 'none': 'block'}}
				onClick={() => {onRequest(offset)}}>
				<div className="inner">load more</div>
			</button>
		</div>
	);
}
CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}
export default CharList;
