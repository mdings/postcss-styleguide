var current;

function request (url, section = null) {
    var pageRequest = false

    if (current != url) {
        if (!pageRequest && typeof XMLHttpRequest != 'undefined') {
            pageRequest = new XMLHttpRequest()
        }

        if (pageRequest) { //if pageRequest is not false
           pageRequest.open('GET', url, false) //get page synchronously
           pageRequest.send(null)
           current = url;
           embed(pageRequest)
           // scroll to the element if section is provided
           jumpTo(section);
       }
   } else {
       jumpTo(section);
   }
}

function jumpTo (section) {
    if(document.getElementById(section)) {
        window.scrollTo(0, document.getElementById(section).offsetTop);
    }
}

function embed (request) {
    // if viewing page offline or the document was successfully retrieved online (status code=2000)
    if (window.location.href.indexOf("http")==-1 || request.status==200) {
        document.getElementById('styleguide__main').innerHTML = request.responseText;
        // reload prism
        Prism.highlightAll();
        bindTogglers();
    }
}

function bindTogglers () {
  var togglers = document.querySelectorAll('.styleguide__icon--code');
  for (var i=0;i<togglers.length;i++) {
    togglers[i].addEventListener('click', function(){
      var codeBlock = this.getAttribute('data-toggle');
      var display = (document.getElementById(codeBlock).style.display != 'block') ? 'block' : 'none';
      document.getElementById(codeBlock).style.display = display;
    })
  }
}

var links = document.querySelectorAll('.styleguide__nav ul a');
for (var i=0; i<links.length; i++) {
    links[i].addEventListener('click', function(e){
        var href = this.getAttribute('href');
        var url = href.split('#').shift();
        var section = href.split('#').pop();
        request(url, section);
        e.preventDefault();
    });
}


// check if there is an absolute path to be reached
if (window.location.href.substr(-1) != '/') window.location = window.location.href + '/';
// load the first option from the dropdown by default
var href = links[0].getAttribute('href');
request(href);
