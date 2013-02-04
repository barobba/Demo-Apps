/**
 * Requires:
 *   jQuery
 *   Mustache.js
 */
function loadMenu (element, menuKey, dataPath) {

  // Load data
  $.getJSON(dataPath + 'menus.json')
  .success(function(response, status, request){

    // Data
    var templateData = response.menus[menuKey];
    var templatePath = templateData.template;
    
    // Load template
    $.get(dataPath + templatePath, {type: 'json'})
    .success(function(response, status, request){

      // Template
      var template = response;
      
      // Render content
      var renderedMenu = Mustache.render(template, templateData)
      //console.log(renderedMenu);
      
      // Insert content
      $(element).html(renderedMenu);
    
    })
    .error(function(request, status, error){
      //console.log('Problem getting template');
      //console.log(error.message);
    });
    
  })
  .error(function(request, status, error){
    //console.log('Problem getting data');
    //console.log(error.message);
  });
  
}
