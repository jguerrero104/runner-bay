import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styles from './LostAndFoundDetails.module.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const LostAndFoundDetails = () => {
    const { id: userId, token, role } = useAuth();
    const [lostAndFound, setLostAndFound] = useState(null);
    const [error, setError] = useState(null);
    const { itemId } = useParams();
    const [isOwner, setIsOwner] = useState(false);
    const isAdmin = role === 'admin';
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLostAndFound = async () => {
            try {
                const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch lost item');
                }
                const data = await response.json();
                setLostAndFound(data);
                setIsOwner(data.reporter_id === userId);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching lost item:', error);
            }
        };
        fetchLostAndFound();
    }, [itemId, token, userId]);

    const handleContactOwner = async () => {
        try {
            const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });
            if (!response.ok) {
                throw new Error('Failed to contact owner');
            }
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error contacting owner:', error);
            alert('Failed to contact owner. Please try again later.');
        }
    };

    const updateLostAndFoundStatus = async (status) => {
        try {
            const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update item status.');
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error updating item status:', error);
            alert('Failed to update item status. Please try again later.');
        }
    };

    const deleteLostAndFound = async () => {
        try {
            const response = await fetch(`http://localhost:3001/lostAndFounds/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete item.');
            alert('Item deleted successfully');
            window.location.href = '/lostAndFounds';
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again later.');
        }
    };

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
                {(isOwner || isAdmin) && (
                    <DropdownButton id="dropdown-item-button" title="Change Status">
                        <Dropdown.Item as="button" onClick={() => updateLostAndFoundStatus('reported')}>Reported</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => updateLostAndFoundStatus('claimed')}>Claimed</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => updateLostAndFoundStatus('expired')}>Expired</Dropdown.Item>
                    </DropdownButton>
                )}
                <div className={`status-badge status-${lostAndFound.status.toLowerCase()}`}>
                    {lostAndFound.status}
                </div>
                <textarea
                    className="form-control"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                ></textarea>
                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-primary" onClick={handleContactOwner}>Contact Owner</button>
                    {(isOwner || isAdmin) && <button onClick={deleteLostAndFound} className="btn btn-danger">Delete Item</button>}
                </div>
            </div>
            <div className={styles['lost-and-found-detail-footer']}>
                Reported on: {new Date(lostAndFound.reportDate).toLocaleDateString()}
            </div>
        </div>
    );
};

export default LostAndFoundDetails;
