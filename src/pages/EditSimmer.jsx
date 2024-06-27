// dependencies
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import { set } from 'lodash';

export function EditSimmer() {

    const { simmerName } = useParams();
    const { id } = useParams();
    const [simmer, setSimmer] = useState('');
    const [url, setUrl] = useState('');

    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedCustomDescription, setEditedCustomDescription] = useState('');
    const [editedImageType, setEditedImageType] = useState('');
    const [editedImageFile, setEditedImageFile] = useState(null);
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
                setEditedImageType(data.image_type || '');    // setEditedImageType(data.image_type || simmer.image_type);
                setEditedImageFile(null);
                setEditedImageUrl(data.image_url || simmer.image_url);
                setEditedUrl(data.url || simmer.url);
            };            
        } catch (error) {
            console.error("Error fetching simmer: ", error.message);
        };
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        let fileData = null;
            if (editedImageFile) {
                fileData = await convertFileToBase64(editedImageFile);
            }

        try {
            const { data, error } = await supabase
                .from('simmers')
                .update([
                    {
                        simmer: editedName,
                        description: editedDescription,
                        custom_description: editedCustomDescription,
                        image_type: editedImageType,
                        image_url: url,
                        image_file: fileData,
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

    const convertFileToBase64 = (editedImageFile) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(editedImageFile);
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleMediaChange = (e) => {
        if (editedImageType != "null") {
            removeImage();
        };
        setEditedImageType(e.target.value);
    };

    const removeImage = () => {
        setEditedImageFile(null);
        setEditedImageUrl('');
        setEditedImageType('');
    };

    return (
        <main id="create-body">
            <h1>Edit Simmer</h1>
            <h3>{simmer.simmer}</h3>

            <form id="new-simmer-form" onSubmit={handleUpdate}>
                <Link to="/" className="n-s-form-btn" id="n-s-form-cancel-btn">X</Link>

                <div id="n-s-form-groups-holder">
                    <div className="n-s-form-group">
                        <input 
                            className="n-s-form-content"
                            type="text" 
                            id="simmer-name" 
                            name="simmer-name" 
                            value={editedName} 
                            onChange={(e) => setEditedName(e.target.value)} 
                            required 
                        />
                        <label htmlFor="simmer-name">Simmer Name</label>
                    </div>

                    <div className="n-s-form-group">
                        {!editedImageType && (
                            <div className="form-input-holder">
                                <select id="media-type" className="n-s-form-content" value={editedImageType} onChange={handleMediaChange}>
                                    <option value="" disabled selected>Select Media Type</option>
                                    <option value="file">File</option>
                                    <option value="url">URL</option>
                                </select>
                                <p className="n-s-form-additional">You can upload a file or enter an URL</p>
                            </div>
                        )}

                        {editedImageType === 'file' && (
                            <div className="form-input-holder">
                                <label htmlFor="post-media-image">Select Image File</label>
                                <input type="file" accept="image/*" id="post-media-image" className="form-input-field create-post-media-img n-s-form-content" onChange={(e) => {
                                    setEditedImageFile(e.target.files[0]);
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setEditedImageUrl(reader.result);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }} />
                            </div>
                        )}

                        {editedImageType === 'url' && (
                            <div className="form-input-holder">
                                <label htmlFor="post-media-url">Enter Image URL</label>
                                <input type="url" id="post-media-url" className="form-input-field create-post-media-img n-s-form-content" onChange={(e) => {
                                    setUrl(e.target.value);
                                    setEditedImageUrl(e.target.value);
                                }} placeholder="Image URL" />
                            </div>
                        )}

                        {editedImageUrl && (
                            <div className="form-img-holder">
                                <button type="button" onClick={removeImage} className="n-s-form-btn n-s-form-content" id="n-s-form-cancel-btn" title="clear image">X</button>
                                <img className="simmer-card-img" id="create-post-img" src={editedImageUrl} alt="Post Image" />
                            </div>
                        )}
                        <label htmlFor="simmer-pic">Simmer Picture</label>
                    </div>

                    <div className="n-s-form-group">
                        <input 
                            className="n-s-form-content"
                            type="url" 
                            id="simmer-url" 
                            name="simmer-url" 
                            value={editedUrl} 
                            onChange={(e) => setEditedUrl(e.target.value)} 
                            required 
                        />
                        <label htmlFor="simmer-url">Simmer Channel URL</label>
                    </div>

                    <div className="n-s-form-group">
                        <textarea 
                            className="n-s-form-content"
                            id="simmer-description" 
                            name="simmer-description" 
                            value={editedDescription} 
                            onChange={(e) => setEditedDescription(e.target.value)} 
                            required
                        ></textarea>
                        <p className="n-s-form-additional">If the Simmer has a description, paste it here!</p>
                        <label htmlFor="simmer-description">Simmer Description</label>
                        
                    </div>

                    <div className="n-s-form-group">
                        <textarea 
                            className="n-s-form-content"
                            id="simmer-custom-description" 
                            name="simmer-custom-description" 
                            value={editedCustomDescription} 
                            onChange={(e) => setEditedCustomDescription(e.target.value)}
                        ></textarea>
                        <p className="n-s-form-additional">Do you have anything to add to their description?</p>
                        <label htmlFor="simmer-custom-description">Custom Description</label>
                        
                    </div>
                </div>

                <div id="n-s-form-outro">
                    <button type="submit" className="n-s-form-btn n-s-form-content">Update Simmer</button>
                    <button id="e-s-form-delete-btn" className="n-s-form-btn n-s-form-content" onClick={handleDelete}>Delete Simmer</button>
                </div>
            </form>
        </main>
    );
};