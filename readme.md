1) Pull mongo image (latest should be fine):

    docker pull mongo

2) Run mongo image:

    docker run -d -p 27017:27017 --name mongodb mongo

3) Start backend by executing 'main.exe'. The main case
    - initializes the database connection,
    - populates the database with default data from 'db/data.json',
    - sets up the required endpoints (
        - 'http://localhost:12345/items'
        - 'http://localhost:12345/createUser'
	    - 'http://localhost:12345/checkTransaction'
	    - 'http://localhost:12345/login'
	    - 'http://localhost:12345/logout'
	    - 'http://localhost:12345/getCoupon')
    - and starts a http server.

4) Install frontend requirements by going to 'shop_frontend' folder and executing

    npm install

5) Start development server by executing

    npm run serve

Coupon logic:
-------------
Once you redeem the coupon, a token is stored in your local storage. A coupon
can only be redeemed once and expiery time is checked by decoding the jwt
header. In order to reset the coupon and test the functionality you have
to
    - delete the token in the local storage of your browser
    - and refresh the page.

In order to change the expiration time of the coupon token, you need edit
line 309 in 'main.go' file.
