
$(document).ready(function(){

  // Options: Animate/Processing/Reset
  // Handle toggling animation button
  $('.option-animate').button();
  $('.option-animate').click(function(event){
    event.preventDefault();
    if (fmaHasState(this, 'ready')) {
      // Start animation
      fmaAnimate(this);
      $(this).find('.ui-button-text').html('Processing...');
      fmaChangeState(this, 'ready', 'processing');
    }
    else if (fmaHasState(this, 'processing')) {
      // Do nothing
    }
    else if (fmaHasState(this, 'finished')) {
      fmaReset();
      $(this).find('.ui-button-text').html('Animate');
      fmaChangeState(this, 'finished', 'reset');
    }
    else {
      // DEFAULT: Start animation
      fmaAnimate(this);
      $(this).find('.ui-button-text').html('Processing...');
      fmaChangeState(this, 'ready', 'processing');
    }
  });

});

function fmaAnimate(element) {

  var stage = $('#felt-marker-animation');
  var cap = stage.find('.marker-cap');
  var marker = stage.find('.marker');
  var appliedColor = $('#applied-color');
  
  // Take off cap
  cap.animate(
    {
      top: -50,
      textIndent: -10 // Used for calculating rotation
    },
    {
      step: function(now, fx){
        fmaRotate(this, now);
      },
      duration: 1000,
      easing: 'swing',
      complete: function(){
      
        marker.css('z-index', 3);
      
        // Rotate pen
        marker.animate(
          {
            top: '-=50px',
            textIndent: 150 // Used for calculating rotation
          },
          {
            step: function(now, fx){
              fmaRotate(this, now);
            },
            duration: 1000,
            easing: 'swing'
          }
        )
        
        // Move pen to bottom corner
        .animate(
          {
            top: '86px',
            left: 469 + (IEVersion <= 8 ? -65 : 0) + 'px'
          },
          {
            duration: 1000,
            easing: 'swing'
          }
        )
        
        // Move pen back toward left
        .animate(
          {
            left: '-=200px'
          },
          {
            step: function (now, fx){
              var nowStep = (now + 65 + (IEVersion <= 8 ? 65 : 0));
              appliedColor.css('visibility', 'visible');
              appliedColor.css('left', nowStep + 'px');
              appliedColor.css('width', (534 - nowStep) + 'px');
            },
            duration: 1000,
            easing: 'swing',
            complete: function(){
              $(element).find('.ui-button-text').html('Reset');
              fmaChangeState('.option-animate', 'processing', 'finished');
            }
          }
        );
        
      }
    }
  );
  
  
}

function fmaReset() {

  var stage = $('#felt-marker-animation');
  
  var cap = stage.find('.marker-cap');
  cap.removeAttr('style');
  
  var marker = stage.find('.marker');
  marker.removeAttr('style');
  
  var appliedColor = $('#applied-color');
  appliedColor.removeAttr('style');
  
}

function fmaHasState(element, state) {
  return $(element).hasClass('fma-state-' + state);
}

function fmaChangeState(element, from, to) {
  $(element).removeClass('fma-state-' + from);
  $(element).addClass('fma-state-' + to);
}

function fmaRotate(element, degrees) {

  $(element).css('-webkit-transform', 'rotate(' + degrees + 'deg)');
  $(element).css('-moz-transform', 'rotate(' + degrees + 'deg)');
  $(element).css('-ms-transform', 'rotate(' + degrees + 'deg)');        
  $(element).css('-o-transform', 'rotate(' + degrees + 'deg)');        
  $(element).css('transform', 'rotate(' + degrees + 'deg)');

  if (IEVersion) {
    var cos = Math.cos(degrees/57.2957795);
    var sin = Math.sin(degrees/57.2957795);
    if (IEVersion <= 8) {
      $(element).css('filter', 'progid:DXImageTransform.Microsoft.Matrix(M11=' + cos + ', M12=' + -sin + ', M21=' + sin + ', M22=' + cos + ', SizingMethod="auto expand")');
      $(element).css('-ms-filter', '"progid:DXImageTransform.Microsoft.Matrix(M11=' + cos + ', M12=' + -sin + ', M21=' + sin + ', M22=' + cos + ', SizingMethod=\'auto expand\')"');
    }
    else {
      // Skip
    }
  }
  else {
    // Skip
  }
  
}

var IEVersion = (function(){
  var undef;
  var v = 3;
  var div = document.createElement('div');
  var all = div.getElementsByTagName('i');
  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  );
  return v > 4 ? v : undef;
}());
