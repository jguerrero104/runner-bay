import React, { useState, useEffect } from 'react';
import MarqueeSlider from 'react-marquee-slider';
import times from 'lodash/times';
import './Home.css';
import { newsItems } from './News';
import { Link } from 'react-router-dom';

const regularNewsItem = newsItems.filter(news => !news.spotlight);

function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3001/listings');  // Adjust the URL as necessary
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  const openArticle = (url) => {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    } else {
      alert('Please allow popups for this website');
    }
  };
  
  return (
    <div>
      <div className='home-news-slider'>
        <MarqueeSlider velocity={20}>
          {regularNewsItem.map(news => (
            <a 
              key={`news-marquee-${news.id}`}  
              href={news.content} 
              target="_blank" 
              rel="noopener noreferrer" 
              className='home-news-item' 
              style={{ width: "70%" }}
            >
              <img src={news.imageUrl} alt={news.title} />
              <h2>{news.title}</h2>
            </a>
          ))}
        </MarqueeSlider>
      </div>
      <div className='home-listings-slider'>
        <MarqueeSlider velocity={25}>
          {listings.map(listing => (
            <div 
              key={`listing-marquee-${listing.listingId}`}
              className='home-listing-item' 
              style={{ width: "100%" }}
            >
              <img src={`http://localhost:3001/uploads/${listing.image_url.replace(/\\/g, '/')}`} alt={listing.title} />
              <h2>{listing.title}</h2>
              <p>{`$${listing.price}`}</p>
            </div>
          ))}
        </MarqueeSlider>
      </div>
    </div>
  );
}

export default Home;
