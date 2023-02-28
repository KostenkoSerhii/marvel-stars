import { Component } from "react"
import PropTypes from 'prop-types';

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidUMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }
	
	updateChar = () => {
    const { charId } = this.props;
    if (!charId) return;

    this.onCharLoading();

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  }

  onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
    });
  };

  onCharLoading = () => {
    this.setState({
      loading: true,
      error: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const { char, loading, error } = this.state;

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
