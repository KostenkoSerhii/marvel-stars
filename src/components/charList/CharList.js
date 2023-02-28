import { Component } from "react";
import PropTypes from 'prop-types';

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
		newItemsloading: false,
		offset: 210,
		// offset: 1548,
		charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  componentWillUnmount() {}

  onCharsLoaded = (newChars) => {
		const ended = newChars.length < 9 ;
    this.setState(({chars, offset}) => {
			return {
				chars: [...chars, ...newChars],
				loading: false,
				newItemsloading: false,
				offset: offset + 9,
				charEnded: ended
			}
		});
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

	onRequest = offset => {
		this.onNewCharsLoading();
		this.marvelService
		.getAllCharacters(offset)
		.then(this.onCharsLoaded)
		.catch(this.onError);
	}

	onNewCharsLoading = () => {
		this.setState({
			newItemsloading: true
		})
	}

	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	}
	focusOnItem = i => {
		this.itemRefs.forEach(item => {
			item.classList.remove('char__item_selected')
		});
		this.itemRefs[i].classList.add('char__item_selected');
		this.itemRefs[i].focus();
	}

  renderItems = (items) => {
    const listItems = items.map(({ name, thumbnail, imageExist, id }, i) => {
      const imgStylesFit = imageExist ? "cover" : "fill";
      return (
        <li
					tabIndex={0}
          className="char__item"
          key={id}
					ref={this.setRef}
          onClick={() => {
						this.props.onCharSelected(id);
						this.focusOnItem(i)
					}}
					onKeyPress={(e) => {
						if (e.key === ' ' || e.key === "Enter") {
								this.props.onCharSelected(id);
								this.focusOnItem(i);
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

  render() {
    const { chars, loading, error,newItemsloading, offset, charEnded } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const load = loading ? <Spinner /> : null;
    const content = !(loading || error) ? this.renderItems(chars) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {load}
        {content}
        <button 
					className="button button__main button__long"
					disabled={newItemsloading}
					style={{'display': charEnded ? 'none': 'block'}}
					onClick={() => {this.onRequest(offset)}}>
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}
CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}
export default CharList;
