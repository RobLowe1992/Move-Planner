
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ", " + city;

    $greeting.text('So, you want to live at ' +address+ '?');

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' +address+ '';

    $body.append('<img class="bgimg" src="' +streetViewUrl+ '">');


    // YOUR CODE GOES HERE!
    var nyTimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyTimesUrl += '?' + $.param({
        'api-key': "8223392edf024cbdad111ab272fbeacd",
        'q': ''+city+''
    });

    $.getJSON(nyTimesUrl, function(data) {
        console.log(data);

        $nytHeaderElem.text('New York Times Articles About '+city+'');

        articles = data.response.docs;

        for(var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li id="'+article._id+'" class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>'+article.snippet+'</p>'+
                '</li>');
        };

    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    var wikiURL = 'https://en.wikipedia.org/w/api.php';
    wikiURL += '?' + $.param({
        'action':'opensearch',
        'search': city
    });

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed To Get Wikipedia Resources');
    }, 8000);

    $.ajax(wikiURL, {
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
            var articles = data[1];

            for(var i = 0; i < articles.length; i++) {
            var article = articles[i];
            var url = 'http://en.wikipedia.org/wiki/' +article;
            $wikiElem.append('<li>'+'<a href="'+url+'">'+
                article+'</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};


$('#form-container').submit(loadData);
