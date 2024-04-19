import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './LostAndFoundDetails.module.css';

const LostAndFoundDetails = () => {
    const [lostAndFound, setLostAndFound] = useState({});
    const [error, setError] = useState(null);
    const { itemId } = useParams();

    useEffect(() => {
        const fetchLostAndFound = async () => {
            try {
                const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}`);
                const data = await response.json();
                setLostAndFound(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching lost item:', error);
            }
        };

        fetchLostAndFound();
    }, [itemId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!lostAndFound) {
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
                    <button className="btn btn-info">Contact Owner</button>
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
