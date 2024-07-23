import React, { useEffect} from 'react';
import { useParams} from 'react-router-dom';
import Hls from "hls.js";

function TrailerPage() {
    const {trailerKey} = useParams();

    useEffect(() => {
        if (trailerKey && trailerKey !== 'na') {
            const video = document.getElementById('hls-player');
            if (video) {
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play();
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
                    video.addEventListener('canplay', () => {
                        video.play();
                    });
                }
            }
        }
    }, [trailerKey]);

    return (
        <div style={{width: '100%', height: '100vh', position: 'relative', backgroundColor: 'white', overflow:'hidden'}}>
            <video id="hls-player" style={{width: '100%', height: '120%', marginTop: '-135px'}} controls/>
        </div>
    );
}

export default TrailerPage;
