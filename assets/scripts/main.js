(function(window) {

  // exit if the browser implements that event
  if ( "onhashchange" in window.document.body ) { return; }

  var location = window.location,
    oldURL = location.href,
    oldHash = location.hash;

  // check the location hash on a 100ms interval
  setInterval(function() {
    var newURL = location.href,
      newHash = location.hash;

    // if the hash has changed and a handler has been bound...
    if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
      // execute the handler
      window.onhashchange({
        type: "hashchange",
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);

})(window)

function request(url){
    var pageRequest = false

    if (!pageRequest && typeof XMLHttpRequest != 'undefined') {
        pageRequest = new XMLHttpRequest()
    }

    if (pageRequest) { //if pageRequest is not false
       pageRequest.open('GET', url, false) //get page synchronously
       pageRequest.send(null)
       embed(pageRequest)
   }
}

function embed(request) {
    // if viewing page offline or the document was successfully retrieved online (status code=2000)
    if (window.location.href.indexOf("http")==-1 || request.status==200) {
        document.getElementById('styleguide__main').innerHTML = request.responseText;
        // reload prism
        Prism.highlightAll();
    }
}

function bindTogglers() {
  var togglers = document.querySelectorAll('.styleguide__icon--code');
  for (var i=0;i<togglers.length;i++) {
    togglers[i].addEventListener('click', function(){
      var codeBlock = this.getAttribute('data-toggle');
      var display = (document.getElementById(codeBlock).style.display != 'block') ? 'block' : 'none';
      document.getElementById(codeBlock).style.display = display;
    })
  }
}

var links = document.querySelector('.styleguide__section');
links.addEventListener('change', function(e){
    var href = this.value;
    request(href + '.html');
    bindTogglers();
    e.preventDefault();
});

// load the first option from the dropdown by default
var href = links[0].value;
request(href + '.html');
bindTogglers();
