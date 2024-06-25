// dependencies
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import { set } from 'lodash';

export function EditSimmer() {

    const { simmerName } = useParams();
    const { id } = useParams();
    const [simmer, setSimmer] = useState('');

    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedCustomDescription, setEditedCustomDescription] = useState('');
    const [editedImageType, setEditedImageType] = useState('');
    const [editedImageFile, setEditedImageFile] = useState('');
    const [editedImageUrl, setEditedImageUrl] = useState('');
    const [editedUrl, setEditedUrl] = useState('');

    const navigate = useNavigate();

    const fetchSimmer = async () => {
        try {

            const { data, error } = await supabase
                .from('simmers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setSimmer(data);

            if (data) {
                setEditedName(data.simmer || simmerName);
                setEditedDescription(data.description || simmer.description);
                setEditedCustomDescription(data.custom_description || simmer.custom_description);
                setEditedImageType(data.image_type || simmer.image_type);
                setEditedImageFile(data.image_file || simmer.image_file);
                setEditedImageUrl(data.image_url || simmer.image_url);
                setEditedUrl(data.url || simmer.url);
            };            
        } catch (error) {
            console.error("Error fetching simmer: ", error.message);
        };
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase
                .from('simmers')
                .update([
                    {
                        simmer: editedName,
                        description: editedDescription,
                        custom_description: editedCustomDescription,
                        image_url: editedImageUrl,
                        url: editedUrl
                    }
                ])
                .eq('id', id);

            if (error) throw error;

            navigate(`/${id}/${editedName}`);
        } catch (error) {
            console.error('Error updating simmer: ', error.message);
        };
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase
                .from('simmers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            navigate('/');
        } catch (error) {
            console.error('Error deleting simmer: ', error.message);
        };
    };

    useEffect(() => {
        fetchSimmer();
    }, [simmerName]);

    return (
        <div>
            <h1>Edit Simmer</h1>
            <p>Form to edit a simmer.</p>
            <h3>{simmer.simmer}</h3>

            <form onSubmit={handleUpdate}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                
                <label htmlFor="description">Description</label>
                <input type="text" id="description" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                
                <label htmlFor="custom-description">Custom Description</label>
                <input type="text" id="custom-description" value={editedCustomDescription} onChange={(e) => setEditedCustomDescription(e.target.value)} />
                
                <label htmlFor="image">Image</label>
                <input type="text" id="image" value={editedImageUrl} onChange={(e) => setEditedImageUrl(e.target.value)} />
                
                <label htmlFor="url">URL</label>
                <input type="text" id="url" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} />
                
                <button type="submit">Update Simmer</button>
            </form>

            <button onClick={handleDelete}>Delete Simmer</button>
        </div>
    );
};