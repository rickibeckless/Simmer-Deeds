import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { supabase, youtubeKey } from '../App';
import sims_plumbob from "../assets/sims_plumbob.png";
import sims_plumbob_avatar from "../assets/sims_plumbob_avatar.png";
import { EditSimmer } from "../pages/EditSimmer";
import { debounce, update } from 'lodash';

export default function Simmer() {
    const { id } = useParams();
    const [simmer, setSimmer] = useState({});
    const [latestVideos, setLatestVideos] = useState([]);
    const [vidUpToDate, setVidUpToDate] = useState(false);

    const fetchSimmer = async () => {
        try {
            const { data, error } = await supabase
                .from('simmers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            };

            setSimmer(data);
        } catch (error) {
            console.log('Error fetching simmer:', error.message);
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

                    console.log("Ran");
                } catch (error) {
                    console.log('Error fetching youtube:', error.message);
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
                .eq('id', id);

            if (error) {
                throw error;
            };

            setSimmer(prev => ({ ...prev, full_description: description }));
        } catch (error) {
            console.log('Error updating simmer:', error.message);
        };
    };

    return (
        <>
            <h1>{simmer.simmer}</h1>
            <p>{simmer.full_description}</p>
        </>
    );
};