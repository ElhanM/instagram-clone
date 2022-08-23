# Instagram clone

## Fullstack small scale web app made using the MERN stack along with Material UI

### Frontend is hosted with netlify and backend with heroku

### Link to project: https://instagram-clone-by-elco.netlify.app/

### .env for client

.env file for client folder contains the following enviromental variables: <br />
REACT_APP_LOCAL_URL= holds local url so I do not send requests to the hosted backend when developing

### .env for server

.env file for server folder contains the following enviromental variables: <br />
MONGO_URI= holds MongoDB connection string <br />
JWT_SECRET= holds 512-bit key generated using https://allkeysgenerator.com/ <br />
JWT_EXPIRE= holds JWT experation date, which in my case is 30d <br />
