import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import TVShows from "./pages/TVShows";
import Latest from "./pages/Latest";
import Movies from "./pages/Movies";
// import MyList from "./components/MyList";
import Trailer from "./components/Trailer";
import Modal from "./components/Modal";
import CastMembers from "./components/CastMembers";

function App(props) {
    return (
        <BrowserRouter className={"app"}>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/tv_shows'} element={<TVShows/>}/>
                <Route path={'/movies'} element={<Movies/>}/>
                <Route path={'/latest'} element={<Latest/>}/>
                {/*<Route path={'/my_list'} element={<MyList/>}/>*/}
                <Route path="/trailer/:trailerKey" element={<Trailer />} />
                <Route path="/modal/:movieId" element={<Modal />} />
                <Route path="/cast/:castId" element={<CastMembers />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;