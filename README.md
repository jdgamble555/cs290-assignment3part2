Assignment 3, Part 2: Adding AJAX and HTML
==========================================
In this assignment you will build on your JavaScript skills to make a functional website that uses asynchronous calls to pull data from an online provider. In addition to this you will allow users to mark favorites and save them using local storage so that they are displayed when they return to the page without the need for any additional AJAX calls.

Requirements
------------
- Users will be able to list recent [Gists](https://developer.github.com/v3/gists/#list-gists) from GitHub.
  - Users will be able to pick between 1 and 5 pages of results to display (a page is 30 results by default). You should use an appropriate input to facilitate this.
    - These need not be displayed as separate pages to the user, it only changes the number of total results
  - Users will be able to select, via check boxes, the langue of Gists they want to see. At a minimum this list will include Python, JSON, JavaScript and SQL
    - Selecting languages should filter out results when the search button is clicked. That is to say if 30 results would have been returned, <= 30 results will be returned due to filtering. Presumably this will often be many less than 30.
    - Selecting no languages should return all Gist results.
  - There should be a search button. Clicking on this button should initiate the search. Results should be displayed without requiring a page reload.
  - After searching users will be able to see, at a minimum the Gist description which will double as a link to the html version of the gist.
    - If you wish to optionally show additional data about the Gists you may do so but it is not required.
  - Gists which have been added to favorites should not show up in the list of Gists returned by the search.
  - Gists listed in the results should have a button to add them to the list of favorites.
    - Clicking this button should visually change the location of the Gist so it shows up in a spatially different location from the list of search results.
    - Clicking the button should save enough data to recreate the description and HTML link on subsequent visits to the page
  - The favorites list should show up upon visiting the page and be marked by a heading. If it is empty the heading should still display.
    - Optionally you can add text indicating that there are no currently saved favorites.
  - Every entry in the favorites should include the description of the Gist and the HTML link to the Gist
  - Every entry in the favorites should have a button to remove it from the list of favorites
    - Clicking that button should make the item immediately disappear and it should not reappear in the favorites list on subsequent reloads.
    
Notes
-----
GitHub returns JSON results. JavaScript has a method [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) to convert JSON into an object. JSON is fairly human readable and corresponds almost directly with the syntax used to create object literals in JavaScript.

GitHub allows a maximum of 60 requests per hour per IP address for anonymous users. This means you need to be judicious with your testing and be careful not to generate endless loops of querying their server.

The API is similar to open weather map. Sending a GET request to https://api.github.com with the appended path will return results. For example a GET request to https://api.github.com/gists returns a page of Gists. Under the overview of the [GitHub API](https://developer.github.com/v3/) there in information on pagination which will be required in order to return more than 1 page of results.

Google Chrome will not allow CORS which are required for this assignment if run from a local file. This means that to test the AJAX functionality you will need to upload the page and JavaScript to the OSU Engineering Web server (recommended) or run a local web server and visit that page (more difficult to set up).
  
Evaluation
----------
Your code must be compatible with: IE 10+ and Chrome, Firefox, Safari, Opera latest stable version
The test protocol for this will be manual. A rough outline will be as follows:
- Run the search with no filtering.
- Naviage to one of the results by clicking the link.
- Run the search with filtering. Make sure the appropriate subset of results is returned.
- Run it again with 5 pages requested, make sure more results are returned.
- Attempt to input 6 pages then search and see what happens, it should not allow this.
- Save some set of results to favorites.
- Refresh the page and make sure they are still there.
- Run the search again and make sure the favorited results are not displayed in the search results.
- Navigate to one of the favorited results.
- Unfavorite some subset of favorites.
- Refresh the page, making sure they are still removed.
- Delete some subset of the favorited results.
