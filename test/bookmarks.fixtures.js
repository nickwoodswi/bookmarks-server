function makeBookmarksArray() {
    return [
      {
        id: 1,
        title: 'Google.com',
        url: 'google.com',
        rating: 3,
        description: 'This is Google'
      },
      {
        id: 2,
        title: 'Yahoo.com',
        url: 'yahoo.com',
        rating: 4,
        description: 'Yahoo this is'
      },
      {
        id: 3,
        title: 'AskJeeves.com',
        url: 'askjeeves.com',
        rating: 5,
        description: 'Search with AskJeeves'
      },
    ];
  }
  
  module.exports = {
    makeBookmarksArray,
  }