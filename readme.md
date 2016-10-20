#Yet Another Number Sorting API
Here's yet another Number Sorting API.
It's pretty simple to use it. Just send a **POST** request to https://numbersort.herokuapp.com/sort with a valid array of integers between 1-1000 in JSON format

Example:
```bash
curl -X "POST" "https://numbersort.herokuapp.com/sort" \
     -H "Content-Type: application/json" \
     -d "[1000,123,1,45,10,13,2,415]"
```

Results:
```
HTTP/1.1 200 OK

Server: Cowboy
Content-Type: application/json; charset=utf-8
X-Powered-By: Express
Via: 1.1 vegur
Etag: W/"1d-b7iVginr+5l8FO+81OiHeA"
Date: Tue, 18 Oct 2016 20:22:43 GMT
Content-Length: 29
Connection: close

[1,2,10,13,45,123,415,1000]
```

You can find the interactive API Documentation [here](https://anypoint.mulesoft.com/apiplatform/kenng/#/portals/organizations/d2983a9b-bcdf-4431-88d0-ce04916f9d4c/apis/5962361/versions/105913/pages/158364) to test the API endpoint from this API Portal too.

#What's powering the API
- Implemented Node.js with the Express framework
- Deployed on Heroku
- API documented in RAML and API Portal is powered by MuleSoft Anypoint Platform
