import axios from '../axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

function Banner({ fetchUrl, isPlaying }) {
    const [movie, setMovie] = useState({});
    const [trailerKey, setTrailerKey] = useState("");
    const [cast, setCast] = useState([]);
    const [genres, setGenres] = useState([]);
    const [maturityRating, setMaturityRating] = useState("");
    const [director, setDirector] = useState("");
    const [audio, setAudio] = useState(true);
    const [player, setPlayer] = useState(null);
    const [showDescription, setShowDescription] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(fetchUrl);
                const movies = request.data.results;

                let trailerFound = false;
                while (movies.length && !trailerFound) {
                    const randomMovie = movies.splice(Math.floor(Math.random() * (movies.length - 1)), 1)[0];
                    if (!randomMovie) break;

                    const trailerRequest = await axios.get(
                        `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
                    );
                    const trailer = trailerRequest.data.results.find(
                        (video) => video.type === "Trailer" && video.site === "YouTube"
                    );
                    if (trailer) {
                        setMovie(randomMovie);
                        setTrailerKey(trailer.key);
                        trailerFound = true;

                        const detailsRequest = await axios.get(
                            `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
                        );

                        const castRequest = await axios.get(
                            `https://api.themoviedb.org/3/movie/${randomMovie.id}/credits?api_key=152c8b59a9b6c242a536ba6e6c6dd497`
                        );
                        setCast(castRequest.data.cast.slice(0, 5));

                        setGenres(detailsRequest.data.genres.map(genre => genre.name));

                        const director = castRequest.data.crew.find(member => member.job === "Director");
                        const directorName = director ? director.name : "Unknown";
                        setDirector(directorName);

                        const maturityRating = detailsRequest.data.adult ? "18+" : "12+";
                        setMaturityRating(maturityRating);
                    }
                }
            } catch (error) {
                console.error("Error fetching movie data or trailer:", error);
            }
        }

        fetchData();
    }, [fetchUrl]);

    useEffect(() => {
        if (trailerKey) {
            const onYouTubeIframeAPIReady = () => {
                const playerInstance = new window.YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: trailerKey,
                    playerVars: {
                        autoplay: 1,
                        mute: audio ? 1 : 0,
                        controls: 0,
                        loop: 1,
                        playlist: trailerKey,
                        rel: 0,
                    },
                    events: {
                        onReady: (event) => {
                            setPlayer(playerInstance);
                            event.target.playVideo();
                        },
                    },
                });
            };

            if (window.YT) {
                onYouTubeIframeAPIReady();
            } else {
                window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            }
        }
    }, [trailerKey, audio]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowDescription(false);
        }, 20000);

        return () => clearTimeout(timer);
    }, [movie]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400 && player && !isPaused) {
                player.pauseVideo();
                setIsPaused(true);
            } else if (window.scrollY <= 400 && player && isPaused) {
                player.playVideo();
                setIsPaused(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [player, isPaused]);

    const handleClick = () => {
        setAudio(!audio);
        if (player) {
            if (audio) {
                player.unMute();
            } else {
                player.mute();
            }
        }
    };

    const handlePlay = () => {
        navigate(`/trailer/${trailerKey}`);
    };

    const handleInfo = () => {
        setShowModal(true);
        if (player) {
            player.pauseVideo();
        }
    };

    if (showModal === true) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }

    const handleModalClose = () => {
        setShowModal(false);
        if (player) {
            player.playVideo();
        }
    };

    useEffect(() => {
        if (isPlaying && player && window.scrollY <= 400) {
            player.playVideo();
        } else if (!isPlaying && player) {
            player.pauseVideo();
        }
    }, [isPlaying, player]);

    return (
        <header className="banner">
            <div className="banner_background">
                <div id="player" className="banner_video" ref={videoRef}></div>
            </div>
            <div className="banner_contents">
                <h1 className={`banner_title ${!showDescription ? 'banner_title--small' : ''}`}>
                    {movie?.title || movie?.name || movie?.original_name}
                </h1>
                {showDescription && (
                    <h1 className="banner_description">{movie?.overview}</h1>
                )}
                <div className="banner_buttons">
                    <button onClick={handlePlay} className="banner_play">
                        <i className="fa fa-play" aria-hidden="true"></i> Play
                    </button>
                    <button onClick={handleInfo} className="banner_info">
                        <div style={{ width: "25px", height: "25px", border: "1px solid white", borderRadius: "50%" }}>
                            <i className="fa fa-info" aria-hidden="true"></i>
                        </div>
                        More Info
                    </button>
                    <button onClick={handleClick} className="banner_audioButton">
                        {audio ? (
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <i className="fa fa-volume-off" aria-hidden="true"></i>
                                <i id="audio" className="fa fa-times" aria-hidden="true"></i>
                            </span>
                        ) : (
                            <i className="fa fa-volume-up" aria-hidden="true"></i>
                        )}
                    </button>
                </div>
            </div>
            <div className="banner-fadeBottom" />
            <Modal
                show={showModal}
                onClose={handleModalClose}
                movie={movie}
                cast={cast}
                trailerKey={trailerKey}
                genres={genres}
                maturityRating={maturityRating}
                director={director}
                player={player}
            />
        </header>
    );
}

export default Banner;