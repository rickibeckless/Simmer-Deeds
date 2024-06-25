import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { supabase, youtubeKey } from '../App';
import sims_plumbob from "../assets/sims_plumbob.png";
import sims_plumbob_avatar from "../assets/sims_plumbob_avatar.png";
import { EditSimmer } from "../pages/EditSimmer";
import { debounce } from 'lodash';

export default function Simmer() {
    const [simmer, setSimmer] = useState([]);
    const { id } = useParams();

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

    // fetch youtube information here.
    // instead of using the yt search api, use yt channel api to get channel info.

    useEffect(() => {
        fetchSimmer();
    }, []);

    return (
        <>
            <h1>{simmer.simmer}</h1>
            <p>Simmer page.</p>
        </>
    );
};