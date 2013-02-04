function wireframe (element) {
  $(element).find('div').each(function(index, div){
    // Place class names inside the div tags
    var classes = $(div).attr('class');
    $(div).prepend(classes);
  });
}
