import React, { useState } from 'react';
import './CreateLostItem.css';
import { useAuth } from './AuthContext';

const CreateLostItem = () => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image_url, setImageFile] = useState(null);
    const [reportDate, setReportDate] = useState('');
    const { isLoggedIn, id } = useAuth();
    console.log('User ID:', id);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!itemName || !description || !location || !image_url || !reportDate) {
            alert('Please fill out all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('image', image_url);
        formData.append('reportDate', reportDate);
        formData.append('reporterId', id);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch('http://localhost:3001/lostAndFounds', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newLostItem = await response.json();
                console.log('Lost item created:', newLostItem);
                alert('Lost item created successfully');
                setItemName('');
                setDescription('');
                setLocation('');
                setImageFile(null);
                setReportDate('');
            } else {
                const errorData = await response.json();
                console.error('Failed to create lost item:', errorData);
            }
        } catch (error) {
            console.error('Error creating lost item:', error);
        }
    };
    if (isLoggedIn) {
    return ( 
        <div className="create-lost-item">
            <h1>Report Lost Item</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Name</label>
                    <input 
                        type="text" 
                        value={itemName} 
                        onChange={(e) => setItemName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Location</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Image</label>
                    <input 
                        type="file" 
                        accept='image/*'
                        onChange={(e) => setImageFile(e.target.files[0])} 
                    />
                </div>
                <div>
                    <label>Report Date</label>
                    <input 
                        type="date" 
                        value={reportDate} 
                        onChange={(e) => setReportDate(e.target.value)} 
                    />
                </div>
                <button type="submit">Report Lost Item</button>
            </form>
        </div>
    );   
    } else {
        return <div style={{ fontSize: '40px' }}>Please log in to report a lost or found item.</div>;
    }
};

export default CreateLostItem;
