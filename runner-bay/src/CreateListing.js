import React, { useState, useEffect } from 'react';
import './CreateListing.css';
import { useAuth } from './AuthContext';

const CreateListing = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const {isLoggedIn, id } = useAuth();
    console.log('User ID:', id);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3001/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    throw new Error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !image || !category || !price) {
            alert('Please fill out all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('sellerId', id);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch('http://localhost:3001/listings', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newListing = await response.json();
                console.log('Listing created:', newListing);
                alert('Listing created successfully!');
                setTitle('');
                setDescription('');
                setImage(null);
                setCategory('');
                setPrice('');

            } else {
                const errorData = await response.json();
                console.error('Error creating listing:', errorData.message);
                
            }            
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    if (isLoggedIn) {
    return (
        <div className="create-listing-page">
            <h1>Create Listing</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div>
                <label>Category</label>
                    <select value={category} onChange={(e) => {
                        const selectedCategoryId = Number(e.target.value);
                        console.log('Selected Category ID:', selectedCategoryId);
                        setCategory(selectedCategoryId);
                    }}>
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button type="submit">Create Listing</button>
            </form>
        </div>
    );
    } else {
        return <div style={{ fontSize: '40px' }}>Please log in to report a lost or found item.</div>;
    }
};

export default CreateListing;
