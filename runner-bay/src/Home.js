import React from 'react';
import MarqueeSlider from 'react-marquee-slider';
import times from 'lodash/times';
import './Home.css';
import { newsItems } from './News';

const regularNewsItem = newsItems.filter(news => !news.spotlight);

function Home() {
  const openArticle = (url) => {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    } else {
      alert('Please allow popups for this website');
    }
  };
  
  return (
    <div className='home-news-slider'>
      <MarqueeSlider velocity={20}>
        {regularNewsItem.map(news => (
          <div key={`marquee-example-${news.id}`}  className='home-news-item' style={{ width: "70%" }}>
            <img src={news.imageUrl} alt={news.title} onClick={() => openArticle(news.content)} />
            <h2>{news.title}</h2>
          </div>
        ))}
      </MarqueeSlider>
    </div>

  );
}

export default Home;

