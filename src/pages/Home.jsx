import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import React, { useState, useEffect } from 'react';

// components
import SimmerCard from '../components/SimmerCard';

export function Home() {

    let [search, setSearch] = useState("");
    let [sortedFull, setSortedFull] = useState("az");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortedFull(e.target.value);
    };

    return (
        <main id="home-body">
            <section id="home-landing">
                <h1>Landing</h1>
                <div id="home-search">
                    <h2>Search Bar</h2>
                    <input type="search" className="simmer-search-bar n-s-form-content" id="home-search-bar" placeholder="Search for simmers" onChange={handleSearch} />
                </div>
            </section>

            <section id="home-content">
                <div id="home-brief">
                    <p className="n-s-form-additional">Search Results or recently added</p>

                    <section className="home-simmer-card-holder" id="home-brief-simmer-card-holder">
                        {(search.length > 0) ? 
                            <SimmerCard cardDataType="search" searchResult={search} /> : 
                            <SimmerCard cardDataType="sort-recent" />
                        }
                    </section>
                </div>

                <div id="home-simmers">
                    <aside>
                        <p>Sort</p>
                        <select id="sort-full" value={sortedFull} onChange={handleSortChange} className="n-s-form-additional">
                            <option value="az">a-z</option>
                            <option value="plumbobs">plumbobs</option>
                        </select>
                    </aside>
                    
                    <section className="home-simmer-card-holder" id="home-all-simmer-card-holder">
                        {(sortedFull === "plumbobs") ?
                            <SimmerCard cardDataType="sort-plumbobs" /> :
                            <SimmerCard cardDataType="sort-az" />
                        }
                    </section>
                </div>
            </section>
        </main>
    )
}