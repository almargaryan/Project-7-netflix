import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function CastMembers({ show, onClose, member }) {
    const [movies, setMovies] = useState([]);
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
                    italianBackdropPath: null
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

                        return {
                            ...movie,
                            trailerKey: trailer ? trailer.key : '',
                            englishBackdropPath: findBackdrop('en')?.file_path || null,
                            russianBackdropPath: findBackdrop('ru')?.file_path || null,
                            spanishBackdropPath: findBackdrop('es')?.file_path || null,
                            portugalBackdropPath: findBackdrop('pt')?.file_path || null,
                            chineseBackdropPath: findBackdrop('zh')?.file_path || null,
                            georgianBackdropPath: findBackdrop('ka')?.file_path || null,
                            italianBackdropPath: findBackdrop('it')?.file_path || null
                        };
                    })
                );

                setMovies(updatedMovies);
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
