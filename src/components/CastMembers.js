import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function CastMembers({ show, onClose, member }) {
    const [movies, setMovies] = useState([]);
    const [myList, setMyList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMoviesByActor = async () => {
            if (!member || !member.id) return;

            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/person/${member.id}/movie_credits?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
                );

                const moviesData = response.data.cast.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    overview: movie.overview,
                    trailerKey: "",
                    englishBackdropPath: null,
                    russianBackdropPath: null,
                    spanishBackdropPath: null,
                    portugalBackdropPath: null,
                    chineseBackdropPath: null,
                    georgianBackdropPath: null,
                    italianBackdropPath: null,
                    maturityRating: null,
                    inMyList: false
                }));

                const updatedMovies = await Promise.all(
                    moviesData.map(async movie => {
                        const trailerResponse = await axios.get(
                            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
                        );
                        const trailers = trailerResponse.data.results;
                        const trailer = trailers.find(video => video.type === 'Trailer' && video.site === 'YouTube');

                        const imagesResponse = await axios.get(
                            `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=152c8b59a9b6c242a536ba6e6c6dd497`
                        );
                        const backdrops = imagesResponse.data.backdrops || [];
                        const findBackdrop = (lang) => backdrops.find(backdrop => backdrop.iso_639_1 === lang);

                        const detailsResponse = await axios.get(
                            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=152c8b59a9b6c242a536ba6e6c6dd497&language=en-US`
                        );

                        return {
                            ...movie,
                            trailerKey: trailer ? trailer.key : '',
                            englishBackdropPath: findBackdrop('en')?.file_path || null,
                            russianBackdropPath: findBackdrop('ru')?.file_path || null,
                            spanishBackdropPath: findBackdrop('es')?.file_path || null,
                            portugalBackdropPath: findBackdrop('pt')?.file_path || null,
                            chineseBackdropPath: findBackdrop('zh')?.file_path || null,
                            georgianBackdropPath: findBackdrop('ka')?.file_path || null,
                            italianBackdropPath: findBackdrop('it')?.file_path || null,
                            maturityRating: detailsResponse.data.adult ? '18+' : '13+',
                            releaseDate: detailsResponse.data.release_date ? new Date(detailsResponse.data.release_date).getFullYear() : '2020'
                        };
                    })
                );

                const savedMyList = JSON.parse(localStorage.getItem('myList')) || [];
                const finalMovies = updatedMovies.map(movie => ({
                    ...movie,
                    inMyList: savedMyList.some(savedMovie => savedMovie.id === movie.id)
                }));

                setMovies(finalMovies);
                setMyList(savedMyList);
            } catch (error) {
                console.error('Error fetching movies by actor:', error);
            }
        };

        fetchMoviesByActor();
    }, [member]);

    const handlePlayButtonClick = (trailerKey) => {
        if (trailerKey) {
            navigate(`/trailer/${trailerKey}`);
        }
    };

    const handleMyListButtonClick = (movieId) => {
        const updatedMovies = movies.map(movie => {
            if (movie.id === movieId) {
                const updatedMovie = { ...movie, inMyList: !movie.inMyList };
                const updatedMyList = updatedMovie.inMyList
                    ? [...myList, updatedMovie]
                    : myList.filter(m => m.id !== movieId);

                setMyList(updatedMyList);
                localStorage.setItem('myList', JSON.stringify(updatedMyList));
                return updatedMovie;
            }
            return movie;
        });
        setMovies(updatedMovies);
    };

    const truncateDescription = (description, maxLength) => {
        if (description.length <= maxLength) return description;
        return `${description.slice(0, maxLength)}...`;
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div className="cast-member-overlay" onClick={handleOverlayClick}>
            <div className="cast-member">
                <button className="cast-member-close" onClick={onClose}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                <center><h1 className="cast-member-title">{member.name}</h1></center>
                <div className="cast-member-movies">
                    {movies.map((movie) => (
                        <div key={movie.id} className="cast-member-movie">
                            <div className="cast-member-movie-poster" onClick={() => handlePlayButtonClick(movie.trailerKey)}>
                                <img
                                    src={`https://image.tmdb.org/t/p/original/${movie.englishBackdropPath || movie.spanishBackdropPath || movie.russianBackdropPath || movie.portugalBackdropPath || movie.chineseBackdropPath || movie.georgianBackdropPath || movie.italianBackdropPath || movie.poster_path || "tdlHJ8KoOd9UgUygCWQ3fKRNkAR.jpg"}`}
                                    alt={movie.title}
                                />
                                <div className="member_play-icon">
                                    <i className="fa fa-play" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="cast-member-movie-details">
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
            </div>
        </div>
    );
}

export default CastMembers;
