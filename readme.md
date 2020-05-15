Set Up Project
==============
1) Pull mongo image:

    docker pull mongo

2) Run mongo image:

    docker run -d -p 27017:27017 --name mongodb mongo

3) Start backend by executing 'main.exe'. The main case
    - initializes the database connection,
    - populates the database with default data from 'db/data.json',
    - adds a root user,
    - sets up the required endpoints (
        - 'http://localhost:12345/items'
        - 'http://localhost:12345/createUser'
	    - 'http://localhost:12345/checkTransaction'
	    - 'http://localhost:12345/login'
	    - 'http://localhost:12345/logout'
	    - 'http://localhost:12345/getCoupon')
    - and starts a http server.

4) Install frontend requirements by changing to 'shop_frontend' directory in
a second console tab and executing

    npm install

5) Start development server by executing

    npm run serve

6) Start browsing at http://localhost:8080/


Final notes
===========
Authentication logic:
--------------------
The authentication logic is rawly implemented. You recieve a jwt token, which
is stored in your local storage. However, there's no expiration time checking
nor refresh token logic implemented, yet. That means, you are logged in as
long as the token is in your local storage.

Coupon logic:
-------------
Once you redeem the coupon, a token is stored in your local storage. A coupon
can only be redeemed once and expiery time is checked by decoding the jwt
header. However, the token is not referenced in the database. Therefore, you
have to
    - delete the token in the local storage of your browser
    - and refresh the page,

in order to recieve a fresh coupon and test the functionality multiple times.

In order to change the expiration time of the coupon token, you need to edit
line 309 in 'main.go' file.
