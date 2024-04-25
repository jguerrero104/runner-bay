import React, { useState, useEffect } from 'react';
import MarqueeSlider from 'react-marquee-slider';
import { newsItems } from './News';
import ListingCard from './ListingCard'; // Import the ListingCard component
import LostAndFoundCard from './LostAndFoundCard'; // Import the LostAndFoundCard component
import './Home.css';

function Home() {
  const [listings, setListings] = useState([]);
  const [lostAndFounds, setLostAndFounds] = useState([]);

  // Simulated news items
  const regularNewsItem = newsItems.filter(news => !news.spotlight);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingResponse = await fetch('http://localhost:3001/listings');
        const lostAndFoundResponse = await fetch('http://localhost:3001/lostAndFounds');

        if (!listingResponse.ok || !lostAndFoundResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const listingData = await listingResponse.json();
        const lostAndFoundData = await lostAndFoundResponse.json();

        setListings(listingData);
        setLostAndFounds(lostAndFoundData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* News Section */}
      <div className='home-news-slider'>
        <MarqueeSlider velocity={8}>
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

      {/* Listings Section */}
      <div className='home-listings'>
        <h2>Listings</h2>
        <div className='listings-container'>
          
          {listings.map(listing => (
            <ListingCard key={listing.listingId} listing={listing}/>
          ))}
        </div>
      </div>

      {/* Lost & Found Section */}
      <div className='home-lost-and-found'>
        <h2>Lost & Found</h2>
        <div className='lost-and-found-container'>
          {lostAndFounds.map(lostAndFound => (
            <LostAndFoundCard key={lostAndFound.itemId} lostAndFound={lostAndFound} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
