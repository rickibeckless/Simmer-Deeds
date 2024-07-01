import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import React, { useState, useEffect } from 'react';

// components
import SimmerCard from '../components/SimmerCard';
import PageTitle from '../components/PageTitle';

export function Home() {

    let [search, setSearch] = useState("");
    let [sortedFull, setSortedFull] = useState("az");
    const [simmer, setSimmer] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortedFull(e.target.value);
    };

    const fetchSimmer = async () => {
        try {
            const { data, error } = await supabase
                .from('simmers')
                .select('*');

            if (error) {
                throw new Error(error.message);
            };

            data.sort((a, b) => b.plumbobs - a.plumbobs).slice(0, 5).forEach((simmer, index) => {
                setTimeout(() => {
                    setSimmer(simmer.simmer);
                }, index * 2000);
            });

            setSimmer("Search for a Simmer!");

        } catch (error) {
            console.error("Error fetching simmer: ", error.message);
        };
    };

    useEffect(() => {
        fetchSimmer();
    }, []);

    return (
        <main id="home-body">
            <PageTitle title="Home | Simmer Deeds" />
            <section id="home-landing">
                <div id="home-search">
                    <h3>Looking for someone already here?</h3>
                    <h2>Search For a Simmer!</h2>
                    <input type="search" className="simmer-search-bar n-s-form-content" id="home-search-bar" placeholder={simmer} onChange={handleSearch} />
                    <h4 id="h-s-add-link">And if they're not here, don't worry, you can just 
                        <Link to="/new-simmer"> add them</Link>!
                    </h4>
                </div>
            </section>

            <section id="home-content">
                <div id="home-brief">
                    {search.length > 0 ? 
                        <p className="n-s-form-additional">Search Results for "{search}"</p>
                        : <p className="n-s-form-additional">Recently Added</p>
                    }
                    <section className="home-simmer-card-holder" id="home-brief-simmer-card-holder">
                        {(search.length > 0) ? 
                            <SimmerCard cardDataType="search" searchResult={search} /> : 
                            <SimmerCard cardDataType="sort-recent" />
                        }
                    </section>
                </div>

                <div id="home-simmers">
                    <aside id="h-s-sort-holder">
                        <p>Sort Simmers:</p>
                        <select id="sort-full" title="sort simmers" value={sortedFull} onChange={handleSortChange} className="n-s-form-additional">
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
    );
};