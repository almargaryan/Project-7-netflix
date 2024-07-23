import React, {useState} from 'react';
import Header from "../components/Header";
import requests from "../request";
import Row from "../components/Row";
import Footer from "../components/Footer";

function Latest(props) {

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
            <Header isPlaying={isBannerPlaying}/>
            <div style={{width:"100%", height:"100px", background:"#141414", marginTop:"150px"}}></div>
            <Row title={"Upcoming Films"} fetchUrl={requests.fetchUpcoming} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"Upcoming TV Shows"} fetchUrl={requests.fetchAiringTodayTvShows} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Row title={"On The Air"} fetchUrl={requests.fetchOnTheAirTvShows} onVideoPlay={handleRowVideoPlay} onVideoStop={handleRowVideoStop}/>
            <Footer/>
        </div>
    );
}

export default Latest;