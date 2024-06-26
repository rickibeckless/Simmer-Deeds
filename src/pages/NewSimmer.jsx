// dependencies
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase, youtubeKey } from '../App';
import sims_plumbob from "../assets/sims_plumbob.png";
import sims_background from "../assets/theSimsBackground.png";
import { debounce } from 'lodash';

export function NewSimmer() {

    const [simmerName, setSimmerName] = useState("");
    const [simmerUrl, setSimmerUrl] = useState("");
    const [simmerID, setSimmerID] = useState('');

    const [image_type, setMedia] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [simmerDescription, setSimmerDescription] = useState('');
    const [simmerCustomDescription, setSimmerCustomDescription] = useState('');
    let [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let fileData = null;
            if (file) {
                fileData = await convertFileToBase64(file);
            }

            const { data, error } = await supabase
                .from('simmers')
                .insert([
                    { 
                        simmer: simmerName,
                        url: simmerUrl,
                        description: simmerDescription,
                        custom_description: simmerCustomDescription,
                        image_type: image_type,
                        image_url: url,
                        image_file: fileData,
                        channel_id: simmerID
                    }
                ]);

            if (error) {
                throw error;
            };

            console.log('New simmer created');
            navigate('/');
        } catch (error) {
            console.error('Error creating simmer:', error.message);
        };
    };

    const fetchYouTubeData = async (query) => {
        if (query.trim() !== '') {
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${query}&fields=items(id/channelId,snippet/title,snippet/description,snippet/thumbnails/default/url,snippet/channelId)&key=${youtubeKey}`);
                const data = await response.json();
    
                if (data.items.length > 0) {
                    const mappedResults = data.items.map(item => ({
                        channelId: item.id.channelId,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnail: item.snippet.thumbnails.default.url,
                        url: `https://www.youtube.com/channel/${item.id.channelId}`
                    }));
    
                    console.log(data);
                    console.log(mappedResults);
                    setSearchResults(mappedResults);
                } else {
                    throw new Error('No channels found');
                }
            } catch (error) {
                console.error('Error searching for channels: ', error.message);
            }
        } else {
            setSearchResults([]);
        };
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSimmerName(newValue);

        if (newValue.trim() === '') {
            setSearchResults([]);
        };
    };

    const handleSearch = () => {
        fetchYouTubeData(simmerName);
    };

    const handleResultClick = (result) => {
        setSimmerName(result.title);
        setSimmerDescription(result.description);
        setSimmerUrl(result.url);
        setUrl(result.thumbnail);
        setSimmerID(result.channelId);
        setMedia('url');

        console.log(result);
        console.log("Simmer Name: ", simmerName);
        console.log("Simmer Description: ", simmerDescription);
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleMediaChange = (e) => {
        if (image_type != "null") {
            removeImage();
        };
        setMedia(e.target.value);
    };

    const removeImage = () => {
        setFile(null);
        setUrl('');
        setImageUrl('');
        setMedia('');
    };

    return (
        <main id="create-body">
            <form id="new-simmer-form" onSubmit={handleSubmit}>
                <Link to="/" className="n-s-form-btn" id="n-s-form-cancel-btn">X</Link>

                <div id="n-s-form-intro">
                    <h1 id="n-s-form-header">Add a Simmer!</h1>
                    <p className="n-s-form-additional">
                        You can search for a Simmer's YouTube and have the information 
                        automatically fill in, OR you can manually enter the Simmer's 
                        information!
                    </p>
                </div>

                <div id="n-s-form-groups-holder">
                    <div className="n-s-form-group">
                        <input 
                            className="n-s-form-content"
                            type="search" 
                            id="simmer-name" 
                            name="simmer-name" 
                            value={simmerName} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <button id="n-s-form-search-btn" className="n-s-form-btn n-s-form-content" type="button" onClick={handleSearch} title="search for simmer's YouTube channel">Search YouTube!</button>
                        <label htmlFor="simmer-name">Simmer Name</label>

                        {searchResults.length > 0 && (
                            <React.Fragment>
                                <h2>Search Results:</h2>
                                <div id="create-simmer-search-results">
                                    {searchResults.map(result => (
                                        <div id="simmer-card" key={result.channelId} onClick={() => handleResultClick(result)}>
                                            <img className="simmer-card-img" src={result.thumbnail} alt={result.title} />
                                            <h3><a className="simmer-card-link" href={result.url}>{result.title}</a></h3>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                    </div>

                    <div className="n-s-form-group">
                        {!image_type && (
                            <div className="form-input-holder">
                                <select id="media-type" className="n-s-form-content" value={image_type} onChange={handleMediaChange}>
                                    <option value="" disabled selected>Select Media Type</option>
                                    <option value="file">File</option>
                                    <option value="url">URL</option>
                                </select>
                                <p className="n-s-form-additional">You can upload a file or enter an URL</p>
                            </div>
                        )}

                        {image_type === 'file' && (
                            <div className="form-input-holder">
                                <label htmlFor="post-media-image">Select Image File</label>
                                <input type="file" accept="image/*" id="post-media-image" className="form-input-field create-post-media-img n-s-form-content" onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setImageUrl(reader.result);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }} />
                            </div>
                        )}

                        {image_type === 'url' && (
                            <div className="form-input-holder">
                                <label htmlFor="post-media-url">Enter Image URL</label>
                                <input type="url" id="post-media-url" className="form-input-field create-post-media-img n-s-form-content" value={url} onChange={(e) => {
                                    setUrl(e.target.value);
                                    setImageUrl(e.target.value);
                                }} placeholder="Image URL" />
                            </div>
                        )}

                        {imageUrl && (
                            <div className="form-img-holder">
                                <button type="button" onClick={removeImage} className="n-s-form-btn n-s-form-content" id="n-s-form-cancel-btn" title="clear image">X</button>
                                <img className="simmer-card-img" id="create-post-img" src={imageUrl} alt="Post Image" />
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
                            value={simmerUrl} 
                            onChange={(e) => setSimmerUrl(e.target.value)} 
                            required 
                        />
                        <label htmlFor="simmer-url">Simmer Channel URL</label>
                    </div>

                    <div className="n-s-form-group">
                        <textarea 
                            className="n-s-form-content"
                            id="simmer-description" 
                            name="simmer-description" 
                            value={simmerDescription} 
                            onChange={(e) => setSimmerDescription(e.target.value)} 
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
                            value={simmerCustomDescription} 
                            onChange={(e) => setSimmerCustomDescription(e.target.value)}
                        ></textarea>
                        <p className="n-s-form-additional">Do you have anything to add to their description?</p>
                        <label htmlFor="simmer-custom-description">Custom Description</label>
                        
                    </div>
                </div>

                <div id="n-s-form-outro">
                    <button type="submit" className="n-s-form-btn n-s-form-content">Create Simmer</button>
                </div>
            </form>
        </main>
    );
};