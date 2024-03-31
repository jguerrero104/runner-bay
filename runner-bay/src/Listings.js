import React, { useState } from 'react';
import './Listings.css';
function Listings() {
  // state to manage list of items
  const [items, setItems] = React.useState([]);

  // state to manage form inputs
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    location: '',
    date: '',
    image: null
  });

  //handle sumbission of form
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!formData.name || !formData.description || !formData.location || !formData.date || !formData.image){
      alert('Please fill out all fields');
      return;
    }

    // item object
    const newItem = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      image: formData.image
    };
    // add new item to item array
    setItems([...items, newItem]);
    //clear form data
    setFormData({
      name: '',
      description: '',
      location: '',
      date: '',
      image: null
    });
  };

  //handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //handle file input change
  const handlefileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  }

  return (
    <div>
      <h1>Listings</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Item Name"
          onChange={handleChange}
        />
        </div>
        <div className="input-container">
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
        />
        </div>
        <div className="input-container">
        <input
          type="text"
          name="location"
          value={formData.location}
          placeholder="Location"
          onChange={handleChange}
        />
        </div>
        <div className="input-container">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        </div>
        <div className="input-container">
        <input
          id='imageUpload'
          type="file"
          name="image"
          accept='image/*'
          onChange={handlefileChange}
        />
        </div>
        <button type="Submit">Add Item</button>
      
      </form>
      {/* Display items */}
      <div className='item-grid'>
        {items.map((item, index) => (
          <div key={index} className='item-card'>
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
