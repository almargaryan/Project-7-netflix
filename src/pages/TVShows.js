import React, {useState} from 'react';
import Header from "../components/Header";
import Banner from "../components/Banner";
import requests from "../request";
import Row from "../components/Row";
import Footer from "../components/Footer";

function TvShows(props) {

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
            <Banner fetchUrl={requests.fetchBooksBased} isPlaying={isBannerPlaying}/>
            <Row title={"Top Rated TV Shows"} fetchUrl={requests.fetchTopRatedSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Only on Netflix"} fetchUrl={requests.fetchNetflixOriginals} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Coming Soon..."} fetchUrl={requests.fetchAiringTodayTvShows} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"On The Air"} fetchUrl={requests.fetchOnTheAirTvShows} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Action and Adventure TV Shows"} fetchUrl={requests.fetchActionAndAdventureSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Comedy TV Shows"} fetchUrl={requests.fetchComedySeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Shows Based on Books"} fetchUrl={requests.fetchBooksBased} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Drama TV Shows"} fetchUrl={requests.fetchDramaSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Fantasy TV Shows"} fetchUrl={requests.fetchFantasySeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"TV Shows for Family"} fetchUrl={requests.fetchFamilySeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"TV Shows for Kids"} fetchUrl={requests.fetchKidsSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Crime and Detective TV Shows"} fetchUrl={requests.fetchCrimeSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Mystery TV Shows"} fetchUrl={requests.fetchMysterySeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Fantasy TV Shows"} fetchUrl={requests.fetchFantasySeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"News"} fetchUrl={requests.fetchNewsSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Reality Shows"} fetchUrl={requests.fetchRealitySeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Soap TV Shows"} fetchUrl={requests.fetchSoapSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Talk Shows"} fetchUrl={requests.fetchTalkSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"War and Politics Shows"} fetchUrl={requests.fetchWarPoliticsSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Western TV Shows"} fetchUrl={requests.fetchWesternSeries} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Footer/>
        </div>
    );
}

export default TvShows;