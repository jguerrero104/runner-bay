module.exports = function override(config, env) {
   
    config.ignoreWarnings = [(warning) => {
      return warning.message.includes('react-marquee-slider');
    }];
    return config;
  };
  