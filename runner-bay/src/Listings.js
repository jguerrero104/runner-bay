import React, { useState } from 'react';
import './Listings.css'; // Import the updated CSS file

function Listings() {
  const [items, setItems] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    location: '',
    date: '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.location || !formData.date || !formData.image) {
      alert('Please fill out all fields');
      return;
    }

    const newItem = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      image: formData.image
    };
    setItems([...items, newItem]);
    setFormData({
      name: '',
      description: '',
      location: '',
      date: '',
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlefileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  }

  return (
    <div>
      <h1 className="listings-h1">Market Place</h1>
      <form onSubmit={handleSubmit}>
        <div className="listings-input-container">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Item Name"
            onChange={handleChange}
          />
        </div>
        <div className="listings-input-container">
          <input
            type="text"
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </div>
        <div className="listings-input-container">
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Location"
            onChange={handleChange}
          />
        </div>
        <div className="listings-input-container">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="listings-input-container">
          <input
            id='imageUpload'
            type="file"
            name="image"
            accept='image/*'
            onChange={handlefileChange}
          />
        </div>
        <button type="submit" className="listings-button">Add Item</button>
      </form>
      <div className='listings-item-grid'>
        {items.map((item, index) => (
          <div key={index} className='listings-item-card'>
            <img src={item.image instanceof Blob ? URL.createObjectURL(item.image) : item.image} alt={item.image} />
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>{item.location}</p>
            <p>{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;

