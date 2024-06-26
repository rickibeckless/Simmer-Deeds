import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import React, { useState, useEffect } from 'react';
import SimmerCard from '../components/SimmerCard';

export function NotFound() {

    let [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <main id="not-found-body">
            <section className="n-f-statement-holder">
                <h1>404</h1>
                <h2>Sorry! There doesn't seem to be anything here.</h2>
            </section>
            <section className="n-f-search-holder">
                <h3>Why don't you search for a Simmer?</h3>
                <input type="search" className="simmer-search-bar n-s-form-content" id="n-f-search-bar" placeholder="Search for simmers" onChange={handleSearch} />

                <div className="result-holder">
                    {(search.length > 0) && 
                        <section className="home-simmer-card-holder" id="home-brief-simmer-card-holder">
                            <SimmerCard cardDataType="search" searchResult={search} />
                        </section>
                    }
                </div>
            </section>
        </main>
    );
};