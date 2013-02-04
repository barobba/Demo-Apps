$(document).ready(function(){

  // Handle search submission
  $('#search-button').click(function(event){
    event.preventDefault();
    var searchString = $('#search-terms').val();
    if (searchString) {
      searchWikipedia(searchString);
    }
    else {
      // Do nothing (empty search string)
    }
  });

  // Send search request
  function searchWikipedia(searchString) {
    var searchURL = 'http://en.wikipedia.org/w/api.php?callback=?&action=opensearch&limit=20&search=' + searchString;
    $.getJSON(searchURL, {format: 'json'})
    .success(function(response, status, request){
    
      //console.log('Success');
      var searchResults = {query: response[0], results: response[1]};
      displayResults(searchResults);
      
      for (itemIndex in searchResults.results) {
        var item = searchResults.results[itemIndex];
        var itemURL = 'http://en.wikipedia.org/w/api.php?callback=?&action=query&prop=pageimages|extracts&explaintext=1&exintro=1&exsentences=1&pithumbsize=100&redirects=1&format=json&titles='+item;
        $.getJSON(itemURL)
        .success(function(response, status, request){
          //console.log(response);
          for (pageid in response.query.pages) {
            var variables = response.query.pages[pageid];
            var searchTitle = response.query.redirects ? response.query.redirects[0].from : variables.title;
            var template = $('#result-template-full').html();
            $('.result[title="'+searchTitle+'"]').html(
              Mustache.render(template, variables)
            );
          }
        })
        .error(function(){
        });
      }
      
    })
    .error(function(){
      //console.log('ERROR RUNNING WIKIPEDIA SEARCH');
    });
  }
  
  // Handle search response
  function displayResults(searchResults) {
    //console.log(searchResults);
    var resultTemplate = $('#result-template').html();
    //console.log(resultTemplate);
    var renderedResults = Mustache.render(resultTemplate, searchResults);
    $('#results .result-container').html(renderedResults);
    $('#results').css('visibility', 'visible');
  }
  
});
