/* Author: Jonathan Gamble
 * Class: CS290 Spring 2015 @ Oregon State University
 * Description: This program will grab gists from
 * GitHub and save them in local storage.
 * Last Modified: 4/26/15
 * IDE: Visual Studio 2013
 */

window.onload = loaded;

function loaded() {
/*This program is not backwards compatible with
 * some versions of internet explorer. I did not include
 * attachEvent() objects etc.
 */
    // handle search event
    document.getElementById('search').addEventListener('click', get_results, false);
    
    // load local storage
    display_bookmarks();
}

function get_results() {
    // clear previous results, get new ones
    document.getElementById('results').innerHTML = '';

    // get the number of pages
    var p = document.getElementById('pages');
    var pages = p.options[p.selectedIndex].value;

    for (var i = 1; i <= pages; ++i)
        ajax("https://api.github.com/gists/public?page=" + i, processResults);
}

function processResults(jsonResults) {
    // set up language search
    var allowedLangs = [];
    var link = new Object;

    var langs_box = document.getElementsByName('language');
    for (var z = 0; z < langs_box.length; ++z) {
        if (langs_box[z].checked)
            allowedLangs.push(langs_box[z].value);
    }
    // go through each result
    for (var i = 0; i < jsonResults.length; ++i) {

        // get id, url, and description
        link.id = jsonResults[i].id;
        link.url = jsonResults[i].html_url;
        link.desc = jsonResults[i].description || "No Description";

        // get possible languages
        var languages = [];
        link.langs = "";
        var files = jsonResults[i].files;
        for (var f in files) {
            if (files[f].language) {
                // don't list langauges more than once
                var found = 0;
                for (var k = 0; k < languages.length; ++k) {
                    if (languages[k] === files[f].language)
                        found = 1;
                }
                if (!found) languages.push(files[f].language);
            }
        }
        var allowed = 0;
        // add the langauges to a pretty string
        for (var j = 0; j < languages.length; ++j) {
            if (allowedLangs) {
                // make sure the language is allowed
                for (var z = 0; z < allowedLangs.length; ++z) {
                    if (allowedLangs[z] === languages[j])
                        allowed = 1;
                }
            }
            link.langs += languages[j];
            if (j !== languages.length - 1) link.langs += ", ";
        }
        // search languages
        if (allowedLangs.length && !allowed)
            continue;

        // create link
        create_link('results', link);

        // handle bookmark events
        document.getElementById(link.url).addEventListener('click', bookmark, false);
    } 
}

function ajax(siteURL, resultsFunction) {
/* The code in this function is modified
 * from "Programming in HTML5 with
 * JavaScript and CSS3: Training Guide" by
 * Glenn Johnson p. 371. While this is pretty
 * much the standard, I did not include backwards
 * compatible XML request objects.
 */

    // get ajax results, run resultsFunction
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var jsonObject = JSON.parse(xmlhttp.response);
            resultsFunction(jsonObject);
        }
    };
    xmlhttp.open('GET', siteURL, true);
    xmlhttp.send();
}

function bookmark() {

    // get link data
    var link = new Object;
    var e = document.getElementById(this.name);
    link.id = e.id;
    link.url = this.id;
    link.desc = this.title;
    link.langs = this.class;

    // create favorite link
    create_link('favorites', link);

    // remove empty placeholder
    if (!localStorage.length) empty_placeholder();

    // save to local storage
    localStorage.setItem(link.id, JSON.stringify(link));

    // remove element from search
    e.parentNode.removeChild(e);

    // handle remove event
    document.getElementById(link.url).addEventListener('click', remove_bookmark, false);
}

function remove_bookmark() {

    var e = document.getElementById(this.name);

    // remove element from favorites
    e.parentNode.removeChild(e);

    // remove from local storage
    localStorage.removeItem(e.id)

    // add empty placeholder if necessary
    if (!localStorage.length) empty_placeholder(1);
}

function display_bookmarks() {

    // get local storage
    if (!localStorage.length) empty_placeholder(1);

    for (var i = 0; i < localStorage.length; ++i) {
        var link = JSON.parse(localStorage.getItem(localStorage.key(i)));

        // create favorite link
        create_link('favorites', link);

        // handle remove event
        document.getElementById(link.url).addEventListener('click', remove_bookmark, false);
    }
}

function empty_placeholder(add) {

    if (add) {
        // add empty placeholder
        var em = document.createElement("li");
        em.innerHTML = "You do not have any favorite gists.";
        em.id = "empty_placeholder";
        var fav = document.getElementById('favorites');
        fav.appendChild(em);
    }
    else {
        // remove empty placeholder
        var fav = document.getElementById('empty_placeholder');
        fav.parentNode.removeChild(fav);
    }
}

function create_link(id, link) {

    var location = document.getElementById(id);

    // create link
    var a = document.createElement('a');
    a.href = link.url;
    a.innerHTML = link.desc;

    // create the bookmark or remove link
    var func = document.createElement('a');
    func.href = "javascript:void(0)";
    func.id = link.url;
    func.title = link.desc;
    func.name = link.id;
    func.class = link.langs;
    func.innerHTML = id === 'results' ? "Bookmark" : "Remove";

    // create the list element and add everything to DOM
    var li = document.createElement("li");
    li.id = link.id;
    li.appendChild(a);
    li.appendChild(document.createElement('br'));
    li.appendChild(document.createTextNode('Languages: ' + link.langs));
    li.appendChild(document.createElement('br'));
    li.appendChild(func);
    li.appendChild(document.createElement('br'));
    li.appendChild(document.createTextNode('\u00A0'));
    location.appendChild(li);
}
