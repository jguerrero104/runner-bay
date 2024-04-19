import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure the path is correct
import styles from './LostAndFoundDetails.module.css';

const LostAndFoundDetails = () => {
    const { token } = useAuth(); // Access the token using the useAuth hook
    const [lostAndFound, setLostAndFound] = useState({});
    const [error, setError] = useState(null);
    const { itemId } = useParams();

    useEffect(() => {
        const fetchLostAndFound = async () => {
            try {
                const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass the token in the request headers
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch lost item');
                }
                const data = await response.json();
                setLostAndFound(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching lost item:', error);
            }
        };
        fetchLostAndFound();
    }, [itemId, token]); // Include token in the dependency array

    // Function to contact the owner of the lost item
    
    const handleContactOwner = async () => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass the token in the request headers
                },
                body: JSON.stringify({ message: 'Your message here' })
            };
            const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}/contact`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to contact owner');
            }
            const data = await response.json();
            console.log('Contact owner response:', data);
        } catch (error) {
            console.error('Error contacting owner:', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (Object.keys(lostAndFound).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles['lost-and-found-detail-container']}>
            <img src={`http://localhost:3001/uploads/${lostAndFound.image_url}`} alt={lostAndFound.itemName} className={styles['lost-and-found-detail-image']} />
            <div className={styles['lost-and-found-detail-body']}>
                <h1 className={styles['lost-and-found-detail-title']}>{lostAndFound.itemName}</h1>
                <p className={styles['lost-and-found-detail-info']}><strong>Location:</strong> {lostAndFound.location}</p>
                <p className={styles['lost-and-found-detail-description']}>{lostAndFound.description}</p>
                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-primary" onClick={handleContactOwner}>Contact</button>
                    <button className="btn btn-danger">Report Item</button>
                </div>
            </div>
            <div className={styles['lost-and-found-detail-footer']}>
                Reported on: {new Date(lostAndFound.reportDate).toLocaleDateString()}
            </div>
        </div>
    );
};

export default LostAndFoundDetails;
