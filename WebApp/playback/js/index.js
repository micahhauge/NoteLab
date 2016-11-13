document.getElementById('change').onclick = function () {
  TweenMax.set(".hi", {visibility: 'visible'});
  TweenMax.staggerFrom(".hi", 2, {scale:0.5, opacity:0, delay:0.5, ease:Elastic.easeOut, force3D:true}, 0.1);
}

$(".hi").click(function(){
  TweenMax.staggerTo(".hi", 0.5, {opacity:0, y:-100, ease:Back.easeIn}, 0.1);
});

$(".song").click(function () {
  var url = document.location.protocol +"//"+ document.location.hostname + ':8000'+ document.location.pathname;
  if (url.indexOf('?') > -1){
     url += '&path=' + $(this).val();
  }else{
     url += '?path=' + $(this).val();
  }
  window.location.href = url;
});
