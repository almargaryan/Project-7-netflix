import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import CastMembers from './CastMembers';

function Modal({ show, onClose, movie, cast = [], trailerKey, genres = [], director, maturityRating }) {
    const [liked, setLiked] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [showMember, setShowMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [inMyList, setInMyList] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (movie && movie.id) {
            const fetchSimilarMovies = async () => {
                try {
                    const response = await axios.get(
                        `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US&page=1`
                    );
                    const movies = response.data.results.slice(0, 15);

                    const moviesData = await Promise.all(
                        movies.map(async (movie) => {
                            const { trailerKey, englishBackdropPath, russianBackdropPath, spanishBackdropPath, portugalBackdropPath, chineseBackdropPath, georgianBackdropPath, italianBackdropPath, maturityRating, releaseDate } = await fetchMovieDetails(movie.id);
                            return { ...movie, trailerKey, englishBackdropPath, russianBackdropPath, spanishBackdropPath, portugalBackdropPath, chineseBackdropPath, georgianBackdropPath, italianBackdropPath, maturityRating, releaseDate };
                        })
                    );

                    setSimilarMovies(moviesData);
                } catch (error) {
                    console.error('Error fetching similar movies:', error);
                }
            };

            fetchSimilarMovies();
        }
    }, [movie]);

    const fetchMovieDetails = async (movieId) => {
        try {
            const detailsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=152c8b59a9b6c242a536ba6e6c6dd497`
            );

            const imagesResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=152c8b59a9b6c242a536ba6e6c6dd497`
            );

            const backdrops = imagesResponse.data.backdrops || [];
            const englishBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'en');
            const russianBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'ru');
            const spanishBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'es');
            const portugalBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'pt');
            const chineseBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'zh');
            const georgianBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'ka');
            const italianBackdrop = backdrops.find(backdrop => backdrop.iso_639_1 === 'it');

            return {
                englishBackdropPath: englishBackdrop ? englishBackdrop.file_path : null,
                russianBackdropPath: russianBackdrop ? russianBackdrop.file_path : null,
                spanishBackdropPath: spanishBackdrop ? spanishBackdrop.file_path : null,
                portugalBackdropPath: portugalBackdrop ? portugalBackdrop.file_path : null,
                chineseBackdropPath: chineseBackdrop ? chineseBackdrop.file_path : null,
                georgianBackdropPath: georgianBackdrop ? georgianBackdrop.file_path : null,
                italianBackdropPath: italianBackdrop ? italianBackdrop.file_path : null,
                maturityRating: detailsResponse.data.adult ? '18+' : '13+',
                releaseDate: detailsResponse.data.release_date ? new Date(detailsResponse.data.release_date).getFullYear() : '2024',
            };
        } catch (error) {
            return {
                englishBackdropPath: null,
                russianBackdropPath: null,
                spanishBackdropPath: null,
                portugalBackdropPath: null,
                chineseBackdropPath: null,
                georgianBackdropPath: null,
                italianBackdropPath: null,
                maturityRating: null,
                releaseDate: null,
            };
        }
    };


    useEffect(() => {
        if (movie && movie.id) {
            const myList = JSON.parse(localStorage.getItem('myList')) || [];
            const isInList = myList.some(item => item.id === movie.id);
            const savedLikeState = JSON.parse(localStorage.getItem('likeState')) || {};
            setLiked(savedLikeState);
            setInMyList(isInList);
        }
    }, [movie]);

    const handleLikeButtonClick = (movieId, likeStatus) => {
        const updatedLiked = { ...liked };

        if (updatedLiked[movieId] === likeStatus) {
            delete updatedLiked[movieId];
        } else {
            updatedLiked[movieId] = likeStatus;
        }

        setLiked(updatedLiked);
        localStorage.setItem('likeState', JSON.stringify(updatedLiked));
    };

    const handlePlayButtonClick = () => {
        navigate(`/trailer/${trailerKey}`);
    };

    const handleMenuHover = hover => {
        setShowMenu(hover);
    };

    const handleMyListButtonClick = (movieId) => {
        if (movieId === movie?.id) {
            if (inMyList) {
                removeFromMyList(movieId);
            } else {
                addToMyList(movieId);
            }
        } else {
            const similarMovieIndex = similarMovies.findIndex(movie => movie.id === movieId);
            if (similarMovieIndex !== -1) {
                if (similarMovies[similarMovieIndex].inMyList) {
                    removeFromMyList(movieId);
                } else {
                    addToMyList(movieId);
                }
            }
        }
    };


    const addToMyList = (id) => {
        const myList = JSON.parse(localStorage.getItem('myList')) || [];
        const movieToAdd = id === movie.id ? movie : similarMovies.find(m => m.id === id);

        if (movieToAdd && !myList.some(m => m.id === movieToAdd.id)) {
            const updatedList = [...myList, movieToAdd];
            localStorage.setItem('myList', JSON.stringify(updatedList));

            if (id === movie.id) {
                setInMyList(true);
            } else {
                setSimilarMovies(similarMovies.map(m =>
                    m.id === id ? { ...m, inMyList: true } : m
                ));
            }
        }
    };

    const removeFromMyList = (id) => {
        const myList = JSON.parse(localStorage.getItem('myList')) || [];
        const updatedList = myList.filter(item => item.id !== id);
        localStorage.setItem('myList', JSON.stringify(updatedList));

        if (id === movie.id) {
            setInMyList(false);
        } else {
            setSimilarMovies(similarMovies.map(m =>
                m.id === id ? { ...m, inMyList: false } : m
            ));
        }
    };

    const handleSimilarMovieClick = (trailerKey) => {
        navigate(`/trailer/${trailerKey}`);
    };

    const handleCastMemberClick = member => {
        setSelectedMember(member);
        setShowMember(true);
    };

    const handleMemberClose = () => {
        setShowMember(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const truncateDescription = (description, maxLength) => {
        if (description.length <= maxLength) return description;
        return `${description.slice(0, maxLength)}...`;
    };

    if (!show || !movie) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
                <div className={"modal_banner"}>
                    <button className="modal-close" onClick={onClose}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    <img
                        className="modal_postPic"
                        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path }`}
                        alt={movie.title || movie.name || movie.original_name}
                    />
                    <h1 className="modal_title">{movie?.title || movie?.name || movie?.original_name}</h1>
                    <div className="modal_buttons">
                        <div onClick={handlePlayButtonClick} className="modal_playButton">
                            <i className="fa fa-play" aria-hidden="true"></i> <span style={{fontSize:"20px", fontWeight:"bold", marginLeft:"10px"}}> Play</span>
                        </div>
                        {inMyList ? (
                            <button onClick={() => handleMyListButtonClick(movie.id)} className="modal_myList">
                                <i className="fa fa-check" aria-hidden="true"></i>
                            </button>
                        ) : (
                            <button onClick={() => handleMyListButtonClick(movie.id)} className="modal_myList">
                                <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                        )}
                        <button
                            className="modal_likeButton"
                            onMouseEnter={() => handleMenuHover(true)}
                            onMouseLeave={() => handleMenuHover(false)}
                        >
                            <i className={`fa ${
                                liked[movie.id] === 'liked' ? 'fa-thumbs-up' :
                                    liked[movie.id] === 'disliked' ? 'fa-thumbs-down' :
                                        liked[movie.id] === 'superliked' ? 'fa-heart' : 'fa-thumbs-o-up'
                            }`} aria-hidden="true"></i>
                            {showMenu && (
                                <div className="modal_likeMenu">
                                    <button onClick={() => handleLikeButtonClick(movie.id, 'liked')}>
                                        {liked[movie.id] === 'liked' ? <i className={`fa fa-thumbs-up`} aria-hidden="true"></i> : <i className={`fa fa-thumbs-o-up`} aria-hidden="true"></i>}
                                    </button>
                                    <button onClick={() => handleLikeButtonClick(movie.id, 'disliked')}>
                                        {liked[movie.id] === 'disliked' ? <i className={`fa fa-thumbs-down`} aria-hidden="true"></i> : <i className={`fa fa-thumbs-o-down`} aria-hidden="true"></i>}
                                    </button>
                                    <button onClick={() => handleLikeButtonClick(movie.id, 'superliked')}>
                                        {liked[movie.id] === 'superliked' ? <i className={`fa fa-heart`} aria-hidden="true"></i> : <i className={`fa fa-heart-o`} aria-hidden="true"></i>}
                                    </button>
                                </div>
                            )}
                        </button>
                    </div>
                    <div className="modal-fadeBottom" />
                </div>
                <div className="modal-content">
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <span className="modal_description">
                            <h1 className="modal_date">{movie?.title || movie?.name || movie?.original_name} ({movie?.release_date})</h1>
                            {movie?.overview}
                        </span>
                        <div className="modal_info">
                            <p>
                                <strong style={{color:"grey"}}>Genres:</strong> {genres.join(', ')}
                            </p>
                            <p>
                                <strong style={{color:"grey"}}>Director:</strong> {director}
                            </p>
                            <p>
                                <strong style={{color:"grey"}}>Maturity Rating:</strong> {maturityRating}
                            </p>
                            <div className="modal-cast">
                                <p>
                                    <strong style={{color:"grey"}}>Cast:</strong>{' '}
                                    {cast.map((member, index) => (
                                        <span key={member.id}>
                                    <span onClick={() => handleCastMemberClick(member)} className="cast-link">
                                        {member.name}
                                    </span>
                                            {index < cast.length - 1 && ', '}
                                </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-similar">
                        <h2>More Like This</h2>
                        {similarMovies ? (
                                <div className="similar-movies-container">
                                    {similarMovies.map((movie) => (
                                        <div key={movie.id} className="similar-movie">
                                            <div className={"similar-movie-poster"} onClick={() => handleSimilarMovieClick(movie.trailerKey)}>
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200/${movie.englishBackdropPath || movie.spanishBackdropPath || movie.russianBackdropPath || movie.portugalBackdropPath || movie.chineseBackdropPath || movie.georgianBackdropPath || movie.italianBackdropPath || movie.backdrop_path || movie.poster_path || "tdlHJ8KoOd9UgUygCWQ3fKRNkAR.jpg" }`}
                                                    alt={movie.title}
                                                />
                                                <div className="play-icon">
                                                    <i className="fa fa-play" aria-hidden="true"></i>
                                                </div>
                                            </div>
                                            <div className="similar-movie-info">
                                                <h3>{movie.title}</h3>
                                                <div className={"similar-movie-buttons"}>
                                                    <div style={{width:"110px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                                        <span style={{width:"50px", height:"30px", display:"flex", justifyContent:"center", alignItems:"center", border:"1px solid white"}}>{movie.maturityRating}</span>
                                                        <span>{movie.releaseDate}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleMyListButtonClick(movie.id)}
                                                        className={movie.inMyList ? 'similar-myList active' : 'similar-myList'}
                                                    >
                                                        {movie.inMyList ? (
                                                            <i className="fa fa-check" aria-hidden="true"></i>
                                                        ) : (
                                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                                        )}
                                                    </button>
                                                </div>
                                                <p>{truncateDescription(movie.overview, 100)}</p> {/* Adjust length as needed */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) :
                            <p> There is no similar movies! </p>
                        }
                    </div>
                </div>
                {showMember && (
                    <CastMembers show={showMember} onClose={handleMemberClose} member={selectedMember} />
                )}
            </div>
        </div>
    );
}

export default Modal;

