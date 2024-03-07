
import React from 'react';
import MarqueeSlider from 'react-marquee-slider';
import times from 'lodash/times';

function Home() {
  return (
    <div>
      <MarqueeSlider velocity={25}>
        {times(5, Number).map(id => (
          <div key={`marquee-example-${id}`} style={{ width: "50%" }}>
            <h2>News Item {id + 1}</h2>
            <p>This is a sample news item.</p>
          </div>
        ))}
      </MarqueeSlider>
      {
        
      }
    </div>
  );
}

export default Home;
