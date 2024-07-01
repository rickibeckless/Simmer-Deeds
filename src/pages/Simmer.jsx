import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { supabase, youtubeKey } from '../App';
import { getWebsiteName } from '../components/SimmerCard';
import sims_plumbob from "../assets/sims_plumbob.png";
import sims_plumbob_avatar from "../assets/sims_plumbob_avatar.png";
import { EditSimmer } from "../pages/EditSimmer";
import { debounce, update } from 'lodash';

export default function Simmer() {
    const { simmerName } = useParams();
    const [simmer, setSimmer] = useState({});
    const [latestVideos, setLatestVideos] = useState([]);
    const [vidUpToDate, setVidUpToDate] = useState(false);

    const fetchSimmer = async () => {
        try {
            const { data, error } = await supabase
                .from('simmers')
                .select('*')
                .eq('simmer', simmerName)
                .single();

            if (error) {
                throw error;
            };

            setSimmer(data);
        } catch (error) {
            console.error('Error fetching simmer:', error.message);
        };
    };

    useEffect(() => {
        fetchSimmer();
    }, []);

    useEffect(() => {
        if (simmer?.channel_id && !simmer?.full_description) {
            const fetchYoutube = async () => {
                try {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${simmer.channel_id}&key=${youtubeKey}`);
                    const data = await response.json();
                    const simmerInfo = data.items[0].snippet;
                    await updateSimmer(simmerInfo.description);
                } catch (error) {
                    console.error('Error fetching youtube:', error.message);
                };
            };

            fetchYoutube();
        }
    }, [simmer]);

    const updateSimmer = async (description) => {
        try {
            const { data, error } = await supabase
                .from('simmers')
                .update({
                    full_description: description
                })
                .eq('simmer', simmerName);

            if (error) {
                throw error;
            };

            setSimmer(prev => ({ ...prev, full_description: description }));
        } catch (error) {
            console.error('Error updating simmer:', error.message);
        };
    };

    const givePlumbob = async (id) => {
        try {
            const updatePlumbob = simmer.plumbobs + 1;
            const { data, error } = await supabase
                .from('simmers')
                .update({ plumbobs: updatePlumbob })
                .eq('id', id);

            if (error) {
                throw error;
            };

            setSimmer(prevState => ({
                ...prevState,
                plumbobs: updatePlumbob
            }));

        } catch (error) {
            console.error('Error giving plumbob:', error.message);
        };
    };

    return (
        <main id="simmer-page-body">
            <section id="s-p-info-card">
                <div className="s-p-header">
                    {simmer?.image_type ? (
                        <div className="simmer-card-img-holder">
                            {simmer?.image_type === "file" && (
                                <img src={`data:image/png;base64,${simmer?.image_file}`} alt={`${simmer.simmerName} image`} className="s-p-img" />
                            )}
                            {simmer?.image_type === "url" && (
                                <img src={simmer?.image_url} alt={`${simmer.simmerName} image`} className="s-p-img" />
                            )}
                        </div>
                    ) : 
                        <div className="simmer-card-img-holder">
                            <img src={sims_plumbob_avatar} alt={`${simmer.simmerName} image`} className="simmer-card-img" />
                        </div>
                    }

                    <h2 id="simmer-card-header"><Link to={`/${simmer.simmer}`} className="simmer-card-link">{simmer.simmer}</Link></h2>
                    <p id="simmer-card-channel">see more {simmer.simmer} on
                        {simmer.url && (
                            <a href={simmer.url} target="_blank" rel="noopener noreferrer" id="simmer-card-url" className="simmer-card-link" title={simmer.url}> {getWebsiteName(simmer.url)}</a>
                        )}
                    </p>
                </div>

                <div id="simmer-card-content">
                    

                    <div id="s-c-description-holder">
                        <h4>
                            <span id="s-c-description-name">{simmer.simmer}</span> says: 
                        </h4>
                        <div id="s-c-description" className="s-p-description">{simmer.full_description}</div>
                    </div>

                    {simmer.custom_description && (
                        <div id="s-c-custom-description-holder">
                            <p id="s-c-custom-description-name">a few extra words about {simmer.simmer}: </p>
                            <p id="s-c-custom-description">{simmer.custom_description}</p>
                        </div>
                    )}
                </div>

                <div id="s-p-plumbobs">
                    <p id="s-c-plumbob-description">Like this Simmer? Give them a Plumbob!</p>
                    <p id="s-c-plumbob-holder">
                        <span id="s-c-plumbob-count">{simmer.plumbobs}</span>
                        <button id="plumbob-btn" onClick={() => givePlumbob(simmer.id)}>
                            <img src={sims_plumbob} alt="the sims plumbob" id="plumbob-img" />
                        </button>
                    </p>
                </div>
            </section>

            <Link to={`/${simmer.simmer}/edit-simmer`} id="simmer-card-edit-link">Edit</Link>
        </main>
    );
};