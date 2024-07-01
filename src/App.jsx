// dependencies
import { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// components
import { Home } from './pages/Home';
import { NewSimmer } from './pages/NewSimmer';
import { EditSimmer } from './pages/EditSimmer';
import { NotFound } from './pages/NotFound';

// stylesheets
import './App.css';
import Simmer from './pages/Simmer';

// supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// youtube
export const youtubeKey = import.meta.env.VITE_YOUTUBE_KEY;

function App() {

    const location = useLocation();
    const [isNewSimmerPage, setIsNewSimmerPage] = useState(location.pathname === '/new-simmer');

    useEffect(() => {
        setIsNewSimmerPage(location.pathname === '/new-simmer')
    }, [location.pathname]);

    return (
        <>
            {(!isNewSimmerPage) && 
                <nav id="main-navbar">
                    <Link to="/" id="main-navbar-title">Simmer Deeds</Link>
                    <Link to="/new-simmer">New Simmer</Link>
                </nav>
            }

            <div id="main-body">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/new-simmer" element={<NewSimmer />} />
                    <Route path="/:simmerName" element={<Simmer />} />
                    <Route path="/:simmerName/edit-simmer" element={<EditSimmer />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>

            <footer id="main-footer">
                <p id="footer-cr-statement">
                    Copyright &copy; 2024&nbsp;
                    <a id="footer-cr-link" href="https://github.com/rickibeckless" target="_blank" rel="nofollow noreferrer" title="GitHub: Ricki Beckless">Ricki Beckless</a>
                    . All Rights Reserved.
                </p>
            </footer>
        </>
    );
};

export default App;
