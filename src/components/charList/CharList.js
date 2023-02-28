import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChars();
  }

  componentWillUnmount() {}

  onCharsLoaded = (chars) => {
    this.setState({
      chars,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateChars = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharsLoaded)
      .catch(this.onError);
  };

  renderItems = (items) => {
    const listItems = items.map(({ name, thumbnail, imageExist, id }) => {
      const imgStylesFit = imageExist ? "cover" : "fill";
      return (
        <li
          className="char__item"
          key={id}
          onClick={() => this.props.onCharSelected(id)}
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
    const { chars, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const load = loading ? <Spinner /> : null;
    const content = !(loading || error) ? this.renderItems(chars) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {load}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
