1) Pull mongo image (latest should be fine):

    docker pull mongo

2) Run mongo image:

    docker run -d -p 27017:27017 --name mongodb mongo

3) Start backend by executing 'main.exe'. The main case
    - initializes the database connection,
    - populates the database with default data from 'db/data.json',
    - sets up the required endpoints (
        - 'http://localhost:12345/items'
        - 'http://localhost:12345/check'
        - 'http://localhost:12345/createUser')

    - and starts a http server.
