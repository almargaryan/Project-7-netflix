import axios from '../axios';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'nuka-carousel';
import Modal from "./Modal";
import Hls from "hls.js";
import { VolumeX, Volume2, Play, ChevronDown, ThumbsUp, ThumbsDown, Heart, Check, Plus } from 'lucide-react';

function Row({ title, fetchUrl, onVideoPlay, onVideoStop }) {
    const [movie, setMovie] = useState([]);
    const [liked, setLiked] = useState(null);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [audio, setAudio] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [myList, setMyList] = useState(false);
    // const [showBackdrop, setShowBackdrop] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(fetchUrl);
                const movieData = data.results || [];
                const updatedMovieData = await Promise.all(
                    movieData.map(async (movie) => {
                        const { trailerKey, englishBackdropPath, russianBackdropPath, spanishBackdropPath, portugalBackdropPath, chineseBackdropPath, georgianBackdropPath, italianBackdropPath } = await fetchMovieDetails(movie.id);
                        return { ...movie, trailerKey, englishBackdropPath, russianBackdropPath, spanishBackdropPath, portugalBackdropPath, chineseBackdropPath, georgianBackdropPath, italianBackdropPath };
                    })
                );

                setMovie(updatedMovieData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [fetchUrl]);


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
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=152c8b59a9b6c242a536ba6e6c6dd497`
            );
            const videos = response.data.results || [];
            const youtubeVideo = videos.find(video => video.site.toLowerCase() === 'youtube' && video.type.toLowerCase() === 'trailer');

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
                trailerKey: youtubeVideo ? youtubeVideo.key : "gpv7ayf_tyE",
                englishBackdropPath: englishBackdrop ? englishBackdrop.file_path : null,
                russianBackdropPath: russianBackdrop ? russianBackdrop.file_path : null,
                spanishBackdropPath: spanishBackdrop ? spanishBackdrop.file_path : null,
                portugalBackdropPath: portugalBackdrop ? portugalBackdrop.file_path : null,
                chineseBackdropPath: chineseBackdrop ? chineseBackdrop.file_path : null,
                georgianBackdropPath: georgianBackdrop ? georgianBackdrop.file_path : null,
                italianBackdropPath: italianBackdrop ? italianBackdrop.file_path : null,
            };
        } catch (error) {
            console.error("Error fetching movie details:", error);
            return { trailerKey: null, englishBackdropPath: null, russianBackdropPath: null, spanishBackdropPath: null, portugalBackdropPath: null, chineseBackdropPath: null, georgianBackdropPath: null, italianBackdropPath: null };
        }
    };


    const initializePlayer = (movieId) => {
        const video = document.getElementById(`hls-player-${movieId}`);
        if (video) {
            video.style.width = '305px';
            video.style.height = '175px';
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log('Automatic playback started!');
                            })
                            .catch((error) => {
                                console.error('Auto-play error:', error);
                            });
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
                video.addEventListener('canplay', () => {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log('Automatic playback started!');
                            })
                            .catch((error) => {
                                console.error('Auto-play error:', error);
                            });
                    }
                });
            }
        }
    };


    useEffect(() => {
        if (hoveredMovieId) {
            // const hoveredMovie = movie.find(m => m.id === hoveredMovieId);
            // if (hoveredMovie) {
            //     setShowBackdrop(true);
            //     const timer = setTimeout(() => {
            //         setShowBackdrop(false);
            initializePlayer(hoveredMovieId);
            //     }, 2000);
            //     return () => clearTimeout(timer);
            // }
        }
    }, [hoveredMovieId]);


    const handleClick = (movie) => {
        const videoId = movie.trailerKey;
        navigate(`/trailer/${videoId || 'na'}`, { state: { movie } });
    };

    const handleMouseEnter = (movieId) => {
        setHoveredMovieId(movieId);
        onVideoPlay();
    };

    const handleMouseLeave = () => {
        setHoveredMovieId(null);
        onVideoStop();
    };

    const handleMuteToggle = (movieId) => {
        const video = document.getElementById(`hls-player-${movieId}`);
        video.muted = !video.muted;
        const isMuted = video.muted;
        setAudio(isMuted);
    };

    const handleInfo = async (movie) => {
        setSelectedMovie(movie);
        try {
            const detailsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
            );
            const creditsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
            );


            const genres = detailsResponse.data.genres.map(genre => genre.name);
            const director = creditsResponse.data.crew.find(member => member.job === "Director")?.name || 'Unknown';
            const cast = creditsResponse.data.cast.slice(0, 5);
            const maturityRating = detailsResponse.data.adult ? "18+" : "12+";

            setSelectedMovie(prevMovie => ({
                ...prevMovie,
                genres,
                director,
                cast,
                maturityRating
            }));

            setShowModal(true);
        } catch (error) {
            console.error("Error fetching additional movie details:", error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto';
        onVideoStop()
    };

    if (showModal===true){
        document.body.style.overflow = 'hidden';
        onVideoPlay()
    }



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
    }

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


    const handleMenuHover = (hover) => {
        setShowMenu(hover);
    };


    return (
        <div className="row">
            <h2 className="row_title">{title}</h2>
            <Carousel
                className="row_posters"
                slidesToShow={6}
                slidesToScroll={6}
                dragging={false}


                renderCenterLeftControls={({ previousSlide }) => (
                    <button
                        className="carousel-button"
                        onClick={previousSlide}
                        title="Previous Slide"
                    >
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                )}
                renderCenterRightControls={({ nextSlide }) => (
                    <button
                        className="carousel-button"
                        onClick={nextSlide}
                        title="Next Slide"
                    >
                        <i className="fa fa-chevron-right" aria-hidden="true"></i>
                    </button>
                )}
                scrollMode={'remainder'}
                renderBottomCenterControls={null}
            >
                {movie.map(movie => (
                    <div
                        key={movie.id}
                        className={`row_posterContainer ${hoveredMovieId === movie.id ? 'hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter(movie.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {hoveredMovieId === movie.id ? (
                            <div className="row_trailer">
                                {/*{showBackdrop ? (*/}
                                {/*    <img*/}
                                {/*        className='trailer_iframe'*/}
                                {/*        src={`https://image.tmdb.org/t/p/w500${movie.englishBackdropPath}`}*/}
                                {/*        alt={movie.title}*/}
                                {/*    />*/}
                                {/*) : (*/}
                                {/*    <div>*/}
                                <video
                                    onClick={() => handleClick(movie)}
                                    id={`hls-player-${movie.id}`}
                                    className="trailer_iframe"
                                    autoPlay
                                    muted={audio}
                                />
                                <button onClick={() => handleMuteToggle(movie.id)} className="row_audioButton">
                                    {audio ? <span style={{display:"flex", alignItems:"center"}}><VolumeX /> </span> : <Volume2 />}
                                </button>
                                {/*    </div>*/}
                                {/*)}*/}

                                <div className="row_movieTitle">
                                    <span>{movie.title} </span>
                                </div>
                                <div className="row_buttons">
                                    <div className={"row_trailerButtons"}>
                                        <div className={"row_playButton"} onClick={() => handleClick(movie)}><Play fill={"black"}/></div>
                                        <button
                                            onClick={() => handleMyListButtonClick(movie)}
                                        >
                                            {myList.some(item => item.id === movie.id) ? (
                                                <>
                                                    <Check />
                                                </>
                                            ) : (
                                                <>
                                                    <Plus />
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="row_likeButton"
                                            onMouseEnter={() => handleMenuHover(true)}
                                            onMouseLeave={() => handleMenuHover(false)}
                                        >
                                            {
                                                liked[movie.id] === 'liked' ? <ThumbsUp fill={"white"} className={"i"}/> :
                                                    liked[movie.id] === 'disliked' ? <ThumbsDown fill={"white"} className={"i"}/> :
                                                        liked[movie.id] === 'superliked' ? <Heart fill={"white"} className={"i"}/> :
                                                            <ThumbsUp />
                                            }
                                            {showMenu && (
                                                <div className="row_likeMenu">
                                                    <button onClick={() => handleLikeButtonClick(movie.id, 'liked')}>
                                                        {liked[movie.id] === 'liked' ? <ThumbsUp fill={"white"} className={"i"}/> : <ThumbsUp className={"i"} />}
                                                    </button>
                                                    <button onClick={() => handleLikeButtonClick(movie.id, 'disliked')}>
                                                        {liked[movie.id] === 'disliked' ? <ThumbsDown fill={"white"} className={"i"}/> : <ThumbsDown className={"i"}/>}
                                                    </button>
                                                    <button onClick={() => handleLikeButtonClick(movie.id, 'superliked')}>
                                                        {liked[movie.id] === 'superliked' ? <Heart fill={"white"} className={"i"}/> : <Heart className={"i"}/>}
                                                    </button>
                                                </div>
                                            )}
                                        </button>

                                    </div>
                                    <button onClick={() => handleInfo(movie)} className="infoButton">
                                        <ChevronDown />
                                    </button>
                                </div>
                                <div className="row_movieInfo">
                                    <span>Release Date: {movie.release_date ? new Date(movie.release_date).getFullYear() : '2024'} </span>
                                    <span style={{width:"40px", height:"20px", display:"flex", justifyContent:"center", alignItems:"center", border:"1px solid white", fontSize:"15px"}}>{movie.adult ? "18+" : "12+"}</span>
                                </div>
                            </div>
                        ) : (
                            <img
                                onClick={() => handleClick(movie)}
                                style={{borderRadius:"5px"}}
                                width="225px"
                                height="125px"
                                src={`https://image.tmdb.org/t/p/w500/${movie.englishBackdropPath || movie.spanishBackdropPath || movie.russianBackdropPath || movie.portugalBackdropPath || movie.chineseBackdropPath || movie.georgianBackdropPath || movie.italianBackdropPath || movie.backdrop_path || "tdlHJ8KoOd9UgUygCWQ3fKRNkAR.jpg" }`}
                                alt={movie.name || movie.title}
                            />
                        )}
                    </div>
                ))}
            </Carousel>

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
        </div>
    );

}

export default Row;

