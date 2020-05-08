1) Pull mongo image (latest should be fine):

    docker pull mongo

2) Run mongo image:

    docker run -d -p 27017:27017 --name mongodb mongo

3) Start backend by executing 'main.exe'. The script populates the database
with default data from db/data.json, sets up the required endpoint
('http://localhost:12345/items') and starts a http server.
