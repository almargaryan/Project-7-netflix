import axios from '../axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "./Modal";
import Header from "./Header";
import Footer from "./Footer";

function MyList() {
    const [movies, setMovies] = useState([]);
    const [liked, setLiked] = useState({});
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [audio, setAudio] = useState(true);
    const [players, setPlayers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [myList, setMyList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedMyList = JSON.parse(localStorage.getItem('myList')) || [];
                setMovies(savedMyList);

                await Promise.all(
                    savedMyList.map(async (movie) => {
                        const trailerKey = await fetchMovieDetails(movie.id);
                        return {
                            ...movie,
                            trailerKey: trailerKey || null,
                        };
                    })
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleLocalStorage = () => {
            const savedLikeState = JSON.parse(localStorage.getItem('likeState')) || {};
            setLiked(savedLikeState);

            const savedMyList = JSON.parse(localStorage.getItem('myList')) || [];
            setMyList(savedMyList);
        };

        handleLocalStorage();
    }, []);

    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
            );
            const videos = response.data.results || [];

            const youtubeVideo = videos.find(video => video.site.toLowerCase() === 'youtube' && video.type.toLowerCase() === 'trailer');
            return youtubeVideo ? youtubeVideo.key : null;
        } catch (error) {
            console.error("Error fetching movie details:", error);
            return null;
        }
    };

    const handleClick = (movie) => {
        const videoId = movie.trailerKey;
        navigate(`/trailer/${videoId || 'na'}`, { state: { movie } });
    };

    const handleMouseEnter = (movieId) => {
        setHoveredMovieId(movieId);
    };

    const handleMouseLeave = () => {
        setHoveredMovieId(null);
    };

    const handleMuteToggle = (movieId) => {
        const player = players[movieId];
        if (player) {
            audio ? player.unMute() : player.mute();
            setAudio(!audio);
        }
    };

    const handleInfo = async (movie) => {
        setSelectedMovie(movie);

        try {
            const detailsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
            );
            const creditsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=152c8b59a9b6c242a536ba6e6c6dd497`
            );

            const genres = detailsResponse.data.genres.map(genre => genre.name);
            const director = creditsResponse.data.crew.find(member => member.job === "Director")?.name || 'Unknown';
            const cast = creditsResponse.data.cast.slice(0, 5);
            const maturityRating = detailsResponse.data.adult ? "18+" : "PG";

            setSelectedMovie(prevMovie => ({
                ...prevMovie,
                genres,
                director,
                cast,
                maturityRating
            }));

            setShowModal(true);
            Object.values(players).forEach(player => player.pauseVideo());
        } catch (error) {
            console.error("Error fetching additional movie details:", error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        Object.values(players).forEach(player => player.playVideo());
    };

    const initializePlayer = (movieId, trailerKey) => {
        const onYouTubeIframeAPIReady = () => {
            const playerInstance = new window.YT.Player(`player-${movieId}`, {
                height: '100%',
                width: '100%',
                videoId: trailerKey,
                playerVars: {
                    autoplay: 1,
                    mute: audio ? 1 : 0,
                    controls: 0,
                    loop: 1,
                    playlist: trailerKey,
                },
                events: {
                    onReady: (event) => {
                        setPlayers(prevPlayers => ({
                            ...prevPlayers,
                            [movieId]: playerInstance,
                        }));
                        event.target.playVideo();
                    },
                },
            });
        };

        if (window.YT && typeof window.YT.Player === 'function') {
            onYouTubeIframeAPIReady();
        } else {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        }
    };

    const addToMyList = (movie) => {
        const updatedList = [...myList, movie];
        localStorage.setItem('myList', JSON.stringify(updatedList));
        setMyList(updatedList);
    };

    const removeFromMyList = (movie) => {
        const updatedList = myList.filter(item => item.id !== movie.id);
        localStorage.setItem('myList', JSON.stringify(updatedList));
        setMyList(updatedList);
    };

    const handleMyListButtonClick = (movie) => {
        if (myList.some(item => item.id === movie.id)) {
            removeFromMyList(movie);
        } else {
            addToMyList(movie);
        }
    };

    const handleLikeButtonClick = (movieId, likeStatus) => {
        const updatedLiked = { ...liked };

        if (updatedLiked[movieId] === likeStatus) {
            delete updatedLiked[movieId];
        } else {
            updatedLiked[movieId] = likeStatus;
        }

        setShowMenu(false)
        setLiked(updatedLiked);
        localStorage.setItem('likeState', JSON.stringify(updatedLiked));
    };

    const handleMenuHover = hover => {
        setShowMenu(hover);
    };

    return (
        <div className="myList">
            <Header/>
            <h2 className="myList_title">My List</h2>
            <div className="myList_posters">
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        className={`myList_posterContainer ${hoveredMovieId === movie.id ? 'hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter(movie.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {hoveredMovieId === movie.id ? (
                            <div className="myList_trailer">
                                {movie.trailerKey ? (
                                    <>
                                        <div id={`player-${movie.id}`} className="trailer_iframe"></div>
                                        {initializePlayer(movie.id, movie.trailerKey)}
                                        <button onClick={() => handleMuteToggle(movie.id)} className="myList_audioButton">
                                            {audio ? <i className="fa fa-volume-off" aria-hidden="true"></i> : <i className="fa fa-volume-up" aria-hidden="true"></i>}
                                        </button>
                                        <div className="myList_movieInfo">
                                            <span>{movie.title} </span>
                                            <span>{movie.release_date ? "("+new Date(movie.release_date).getFullYear()+")" : ''} </span>
                                            <span>{movie.adult ? "18+" : "12+"}</span>
                                        </div>
                                        <div className="myList_buttons">
                                            <div className={"myList_trailerButtons"}>
                                                <div className={"myList_playButton"} onClick={() => handleClick(movie)}><i className="fa fa-play" aria-hidden="true"></i></div>
                                                <button
                                                    onClick={() => handleMyListButtonClick(movie)}
                                                >
                                                    {myList.some(item => item.id === movie.id) ? (
                                                        <>
                                                            <i className="fa fa-check" aria-hidden="true"></i>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    className="myList_likeButton"
                                                    onMouseEnter={() => handleMenuHover(true)}
                                                    onMouseLeave={() => handleMenuHover(false)}
                                                >
                                                    <i className={`fa ${liked[movie.id] === 'liked' ? 'fa-thumbs-up' : liked[movie.id] === 'disliked' ? 'fa-thumbs-down' : 'fa-thumbs-o-up'}`} aria-hidden="true"></i>
                                                    {showMenu && (
                                                        <div className="myList_likeMenu">
                                                            <button onClick={() => handleLikeButtonClick(movie.id, 'liked')}>
                                                                <i className={`fa fa-thumbs-up ${liked[movie.id] === 'liked' ? 'active' : ''}`} aria-hidden="true"></i>
                                                            </button>
                                                            <button onClick={() => handleLikeButtonClick(movie.id, 'disliked')}>
                                                                <i className={`fa fa-thumbs-down ${liked[movie.id] === 'disliked' ? 'active' : ''}`} aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                            <button onClick={() => handleInfo(movie)} className="infoButton">
                                                <i className="fa fa-angle-down" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <img
                                            className="myList_backgroundImage"
                                            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path || '/path/to/placeholder.jpg' }`}
                                            alt={movie.name || movie.title}
                                        />
                                        <p className="myList_noTrailer">
                                            Trailer not available
                                        </p>
                                        <div className="myList_buttons">
                                            <div className={"myList_noTrailerButtons"}>
                                                <button
                                                    onClick={() => handleMyListButtonClick(movie)}
                                                    className="myList_button my-list"
                                                >
                                                    {myList.some(item => item.id === movie.id) ? (
                                                        <>
                                                            <i className="fa fa-check" aria-hidden="true"></i>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    className="myList_likeButton"
                                                    onMouseEnter={() => handleMenuHover(true)}
                                                    onMouseLeave={() => handleMenuHover(false)}
                                                >
                                                    <i className={`fa ${liked[movie.id] === 'liked' ? 'fa-thumbs-up' : liked[movie.id] === 'disliked' ? 'fa-thumbs-down' : 'fa-thumbs-o-up'}`} aria-hidden="true"></i>
                                                    {showMenu && (
                                                        <div className="myList_likeMenu">
                                                            <button onClick={() => handleLikeButtonClick(movie.id, 'liked')}>
                                                                <i className={`fa fa-thumbs-up ${liked[movie.id] === 'liked' ? 'active' : ''}`} aria-hidden="true"></i>
                                                            </button>
                                                            <button onClick={() => handleLikeButtonClick(movie.id, 'disliked')}>
                                                                <i className={`fa fa-thumbs-down ${liked[movie.id] === 'disliked' ? 'active' : ''}`} aria-hidden="true"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <img
                                onClick={() => handleClick(movie)}
                                width="200px"
                                height="300px"
                                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                alt={movie.name}
                            />
                        )}
                    </div>
                ))}
            </div>
            {showModal && selectedMovie && (
                <Modal
                    show={showModal}
                    onClose={handleModalClose}
                    movie={selectedMovie}
                    genres={selectedMovie.genres}
                    director={selectedMovie.director}
                    cast={selectedMovie.cast}
                    maturityRating={selectedMovie.maturityRating}
                    trailerKey={selectedMovie.trailerKey}
                />
            )}
            <Footer/>
        </div>
    );
}

export default MyList;
