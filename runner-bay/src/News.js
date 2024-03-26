import React, { useState } from 'react';
import './News.css';

//function News() {
  const newsItems = [
    
    //SPOTLIGHT NEWS ONLY
    { id: 1, title: 'UTSA professor reveals buzz on bee behavior during eclipses', 
    content: 'https://www.utsa.edu/today/2024/03/story/profess-reveals-buzz-on-bees-during-the-eclipse.html', 
    imageUrl: 'https://www.utsa.edu/today/2024/images/bees-ozturk_780.png', spotlight: true},

    { id: 2, title: 'Making eclipse spectable accessible to all with lights and sound', 
    content: 'https://www.utsa.edu/today/2024/03/story/planet-utsa-episode-3.html',
    imageUrl: '	https://www.utsa.edu/today/2024/images/planet-utsa-ep3-lightsound_780.png', spotlight: true},

    { id: 3, title: 'UTSA announces nominees for 2024 University Excellence Awards', 
    content: 'https://www.utsa.edu/today/2024/03/story/2024-university-excellence-awards-announced.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/darrell-najim_780.png', spotlight: true},

    { id: 4, title: 'Austin Claunch named UTSA head men`s basketball coach', 
    content: 'https://www.utsa.edu/today/2024/03/story/austin-claunch-named-head-basketball-coach.html', 
    imageUrl: 'https://www.utsa.edu/today/2024/images/claunch_780.png', spotlight: true},

    //REGULAR NEWS
    { id: 5, title: 'UT Health San Antonio opens facility on UTSA Park West campus', 
    content: 'https://www.utsa.edu/today/2024/03/story/ut-health-opens-facility-at-park-west.html',
    imageUrl: 'https://www.utsa.edu/today/2018/images/ut-health-park-west_680.png' },

    { id: 6, title: 'Greehey Family Foundation commits $1.25 million to capital campaign', 
    content: 'https://www.utsa.edu/today/2024/03/story/greehey-foundation-commits-to-be-bold-campaign.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/greenhey_680-1.png' },

    { id: 7, title: 'UTSA answers evolving market demands with new degree programs', 
    content: 'https://www.utsa.edu/today/2024/03/story/utsa-offers-custom-masters-degree.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/multidiscplinary-studies_680-1.png' },

    { id: 8, title: 'UTSA honors legacy of entrepreneural icon Rosemary Kowalski', 
    content: 'https://www.utsa.edu/today/2024/03/story/rosemary-kowalski-honored-by-utsa.html',
    imageUrl: 'https://www.utsa.edu/today/2018/images/kowalski_680-1.png' },

    { id: 9, title: 'AI school highlights workforce opportunities for UTSA students', 
    content: 'https://www.utsa.edu/today/2024/03/story/AI-experts-challenge-students.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/AI-spring-school-3_680.png' },

    { id: 10, title: 'UTSA joins federal consortium to advance AI safety and security', 
    content: 'https://www.utsa.edu/today/2024/03/story/UTSA-joins-AISIC-to-advance-AI-safety.html', 
    imageUrl: 'https://www.utsa.edu/today/2024/images/SPI_AI_680.png'},

    { id: 11, title: 'UTSA students gain intelligence in the cyber-security industry', 
    content: 'https://www.utsa.edu/today/2024/03/story/students-get-close-look-at-cybersecurity.html',
    imageUrl: 'https://www.utsa.edu/today/2023/images/san-pedro-I_680.png' },

    { id: 12, title: 'Editors Choice: Roadrunners highlight their skills at UTSA Pro Day', 
    content: 'https://www.utsa.edu/today/2024/03/story/players-to-participate-in-utsa-pro-day.html',
    imageUrl: 'https://www.utsa.edu/today/2022/images/football-runout-wku_680.png' },

    { id: 13, title: 'UTSA, Centro simplify travel for students downtown with the Little Runner', 
    content: 'https://www.utsa.edu/today/2024/03/story/utsa-centro-introduce-the-little-runner.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/little-runner_680.png' },

    { id: 14, title: 'Classes to be suspended for two hours during eclipse', 
    content: 'https://www.utsa.edu/today/2024/03/story/classes-to-be-suspended-during-eclipse.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/eclipse-watchers_6801.png' },

    { id: 15, title: 'AI Spring School boosts workforce development for UTSA students', 
    content: 'https://www.utsa.edu/today/2024/03/story/AI-spring-school-boosts-workforce-development.html',
    imageUrl: 'https://www.utsa.edu/today/2024/images/AI-spring-school-2_680.png' },

    { id: 16, title: 'UTSA to host annual Pro Day for football players',
      content: 'https://www.utsa.edu/today/2024/03/story/utsa-hosts-pro-day.html',
      imageUrl: 'https://www.utsa.edu/today/2021/images/football-helmet-2021_680.png' }

    
  ];

  function News() {
  //filter spotlight news and regular articles
  const spotlightNews = newsItems.filter(news => news.spotlight);
  const regularNews = newsItems.filter(news => !news.spotlight);

  //track the expanded news
  const [viewedArticle, setViewedArticle] = useState(null);

  //handleClick function
  const openArticle = (article) => {
    const isExternalLink = article.content.endsWith('.html');

    if(isExternalLink) {
      const win = window.open(article.content, '_blank');
      if(win) 
      {
        win.focus();
      }
      else
      {
        alert('Please allow popups for this website');
      }
    }
    else
    {
      setViewedArticle(article);
    }
  };

  const closeArticle = () => {
    setViewedArticle(null);
  };


  return (
    <div className='news-container'>
      {viewedArticle ? (
        <div className='full-view'>
          <button onClick={closeArticle}>Return to News Feed</button>
          <h2>{viewedArticle.title}</h2>
          <iframe title={viewedArticle.title} src={viewedArticle.content} style={{ width: '100%', height: '900px', border: 'none' }} />
        </div>
      ) : (
        <div>
          {/* Display spotlight news */}
          <div className='top-news'>
            <h1>TOP NEWS</h1>
            <div className='news-feed'>
              {newsItems.filter(news => news.spotlight).map(news => (
                <div key={news.id} className='news-item' onClick={() => openArticle(news)}>
                  <img src={news.imageUrl} alt={news.title} />
                  <h2>{news.title}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Display regular news */}
          <div className='regular-news'>
            <h1>DAILY NEWS</h1>
            <div className='news-feed'>
              {newsItems.filter(news => !news.spotlight).map(news => (
                <div key={news.id} className='news-item' onClick={() => openArticle(news)}>
                  <img src={news.imageUrl} alt={news.title} />
                  <h2>{news.title}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { newsItems, News};
//export default News;