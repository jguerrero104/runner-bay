import React, { useState } from 'react';
import './LostAndFound.css'; 

//Define a function LostAndFound
function LostAndFound() {
  //Declare a variable items and setItems to store the state of the items
  const [items, setItems] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    location: '',
    date: '',
    image: null
  });

  //Define a function handleSubmit that takes an event as an argument
  const handleSubmit = (e) => {
    e.preventDefault();
    //If any of the fields are empty, alert the user to fill out all fields
    if (!formData.name || !formData.description || !formData.location || !formData.date || !formData.image) {
      alert('Please fill out all fields');
      return;
    }
    //Declare a variable newItem and set it to an object with the properties name, description, location, date, and image
    const newItem = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      image: formData.image
    };
    //Set the items state to include the new item
    setItems([...items, newItem]);
    //Reset the form data
    setFormData({
      name: '',
      description: '',
      location: '',
      date: '',
      image: null
    });
  };
  //Define a function handleChange that takes an event as an argument
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  //Define a function handlefileChange that takes an event as an argument
  const handlefileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  }
  //Return a form with input fields for name, description, location, date, and image
  return (
    <div>
      <h1 className="lostandfound-h1">Lost & Found</h1>
      <form onSubmit={handleSubmit}>
        <div className="lostandfound-input-container">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Item Name"
            onChange={handleChange}
          />
        </div>
        <div className="lostandfound-input-container">
          <input
            type="text"
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </div>
        <div className="lostandfound-input-container">
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Location"
            onChange={handleChange}
          />
        </div>
        <div className="lostandfound-input-container">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="lostandfound-input-container">
          <input
            id='imageUpload'
            type="file"
            name="image"
            accept='image/*'
            onChange={handlefileChange}
          />
        </div>
        <button type="submit" className="lostandfound-button">Add Item</button>
      </form>
      <div className='lostandfound-item-grid'>
        {items.map((item, index) => (
          <div key={index} className='lostandfound-item-card'>
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
//Export the LostAndFound function
export default LostAndFound;

