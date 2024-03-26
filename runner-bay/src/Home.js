
import React from 'react';
import MarqueeSlider from 'react-marquee-slider';
import times from 'lodash/times';
import { newsItems } from './News';

const regularNewsItem = newsItems.filter(news => !news.spotlight);

function Home() {
  return (
    <div>
      <MarqueeSlider velocity={5}>
        {regularNewsItem.map(news => (
          <div key={`marquee-example-${news.id}`} style={{ width: "50%" }}>
            <h2>{news.title}</h2>
            <p>{news.content}</p>
          </div>
        ))}
      </MarqueeSlider>
      {
        
      }
    </div>
  );
}

export default Home;
