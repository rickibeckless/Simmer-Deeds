import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { supabase, youtubeKey } from '../App';
import sims_plumbob from "../assets/sims_plumbob.png";
import sims_plumbob_avatar from "../assets/sims_plumbob_avatar.png";
import { EditSimmer } from "../pages/EditSimmer";
import { debounce } from 'lodash';

export default function SimmerCard({ cardDataType, searchResult }) {
    const [simmerName, setSimmerName] = useState([]);

    const fetchSimmer = useCallback(async () => {
        try {
            let sortedData;
            const { data, error } = await supabase
                .from('simmers')
                .select('*');

            if (error) {
                throw error;
            };

            if (cardDataType === "search") {
                sortedData = data.filter(simmer => simmer.simmer.toLowerCase().includes(searchResult.toLowerCase()));
            } else if (cardDataType === "sort-recent") {
                sortedData = data.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 3);
            } else if (cardDataType === "sort-az") {
                sortedData = data.sort((a, b) => a.simmer.toUpperCase().localeCompare(b.simmer));
            } else if (cardDataType === "sort-plumbobs") {
                sortedData = data.sort((a, b) => b.plumbobs - a.plumbobs);
            } else {
                sortedData = data;
            };

            setSimmerName(sortedData);
        } catch (error) {
            console.log('Error fetching simmer:', error.message);
        };
    }, [cardDataType, searchResult]);

    useEffect(() => {
        fetchSimmer();
    }, [fetchSimmer]);

    const givePlumbob = async (id) => {
        try {
            const updatePlumbob = simmerName.find(simmer => simmer.id === id).plumbobs + 1;
            const { data, error } = await supabase
                .from('simmers')
                .update({ plumbobs: updatePlumbob })
                .eq('id', id);

            if (error) {
                throw error;
            };

            setSimmerName(prevState => prevState.map(simmer =>
                simmer.id === id ? { ...simmer, plumbobs: updatePlumbob } : simmer
            ));

        } catch (error) {
            console.log('Error giving plumbob:', error.message);
        };
    };

    const getWebsiteName = (url) => {
        try {
            const hostname = new URL(url).hostname;
            let websiteName = hostname;
    
            if (websiteName.startsWith('www.')) {
                websiteName = websiteName.substring(4);
            };
    
            const parts = websiteName.split('.');
            if (parts.length > 1) {
                websiteName = parts.slice(0, -1).join('.');
            };

            if (websiteName === 'youtube') {
                websiteName = 'YouTube';
            } else {
                websiteName = websiteName.charAt(0).toUpperCase() + websiteName.slice(1);
            };
    
            return websiteName;
        } catch (error) {
            console.error('Invalid URL:', error);
            return null;
        };
    };

    return (
        <>
            {simmerName.map(simmer => (
                <div id="simmer-card" key={simmer.id}>

                    {simmer?.image_type ? (
                        <div className="simmer-card-img-holder">
                            {simmer?.image_type === "file" && (
                                <img src={`data:image/png;base64,${simmer?.image_file}`} alt={`${simmer.simmerName} image`} className="simmer-card-img" />
                            )}
                            {simmer?.image_type === "url" && (
                                <img src={simmer?.image_url} alt={`${simmer.simmerName} image`} className="simmer-card-img" />
                            )}
                        </div>
                    ) : 
                        <div className="simmer-card-img-holder">
                            <img src={sims_plumbob_avatar} alt={`${simmer.simmerName} image`} className="simmer-card-img" />
                        </div>
                    }

                    <div id="simmer-card-content">
                        <h2 id="simmer-card-header"><Link to={`/${simmer.id}/${simmer.simmer}`} className="simmer-card-link">{simmer.simmer}</Link></h2>
                        <p id="simmer-card-channel">see more {simmer.simmer} on
                            <a href={simmer.url} target="_blank" rel="noopener noreferrer" id="simmer-card-url" className="simmer-card-link" title={simmer.url}> {getWebsiteName(simmer.url)}</a>
                        </p>

                        <div id="s-c-description-holder">
                            <h4>
                                <span id="s-c-description-name">{simmer.simmer}</span> says: 
                            </h4>
                            <p id="s-c-description">{simmer.description}</p>
                        </div>

                        {simmer.custom_description && (
                            <div id="s-c-custom-description-holder">
                                <p id="s-c-custom-description-name">a few extra words about {simmer.simmer}: </p>
                                <p id="s-c-custom-description">{simmer.custom_description}</p>
                            </div>
                        )}
                    </div>

                    <div id="simmer-card-plumbobs">
                        <p id="s-c-plumbob-description">Like this Simmer? Give them a Plumbob!</p>
                        <p id="s-c-plumbob-holder">
                            <span id="s-c-plumbob-count">{simmer.plumbobs}</span>
                            <button id="plumbob-btn" onClick={() => givePlumbob(simmer.id)}>
                                <img src={sims_plumbob} alt="the sims plumbob" id="plumbob-img" />
                            </button>
                        </p>
                    </div>

                    <Link to={`${simmer.id}/${simmer.simmer}/edit-simmer`} id="simmer-card-edit-link">Edit</Link>
                </div>
            ))}
        </>
    );
};