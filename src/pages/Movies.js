import React, {useState} from 'react';
import Header from "../components/Header";
import Banner from "../components/Banner";
import requests from "../request";
import Row from "../components/Row";
import Footer from "../components/Footer";

function Movies(props) {

    const [isBannerPlaying, setIsBannerPlaying] = useState(true);

    const handleRowVideoPlay = () => {
        setIsBannerPlaying(false);
        console.log("Video Play Triggered");
    };

    const handleRowVideoStop = () => {
        setIsBannerPlaying(true);
        console.log("Video Stop Triggered");
    };

    return (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", background:"#141414", zIndex:"9999"}}>
            <Header/>
            <Banner fetchUrl={requests.fetchTopRatedMovies} isPlaying={isBannerPlaying}/>
            <Row title={"Top Rated Movies"} fetchUrl={requests.fetchTopRatedMovies} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Action Movies"} fetchUrl={requests.fetchAction} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Adventure Movies"} fetchUrl={requests.fetchAdventure} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Comedy Movies"} fetchUrl={requests.fetchComedy} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Romance Movies"} fetchUrl={requests.fetchRomance} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Drama Movies"} fetchUrl={requests.fetchDrama} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Crime and Detective Movies"} fetchUrl={requests.fetchCrime} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Horror Movies"} fetchUrl={requests.fetchHorror} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Thrillers"} fetchUrl={requests.fetchThriller} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Mystery Movies"} fetchUrl={requests.fetchMystery} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Fantasy Movies"} fetchUrl={requests.fetchFantasy} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Science Fiction Movies"} fetchUrl={requests.fetchScienceFiction} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Movies for Family"} fetchUrl={requests.fetchFamily} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Music Movies and Musicals"} fetchUrl={requests.fetchMusic} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Movies for Kids"} fetchUrl={requests.fetchKids} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Based on Books"} fetchUrl={requests.fetchBooksBased} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Western Movies"} fetchUrl={requests.fetchWestern} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Successful Movies"} fetchUrl={requests.fetchSuccessful} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Footer/>
        </div>
    );
}

export default Movies;