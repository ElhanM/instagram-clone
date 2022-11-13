# Instagram clone

## Fullstack web app made using the MERN stack with user authentication, API debouncing, pagination (infinite scroll done with React Query) and optimistic updates

### Frontend is hosted with netlify and backend with heroku

If you want to check out the project, feel free to create your own account, or use my dummy profile: <br>
Email: test-user@gmail.com <br>
Password: test1234

### External libraries used for frontend: <br />
Material UI, Axios, SCSS, React Router Dom 6, Universal cookie, React Loader Spinner, React Query

### External libraries used for backend: <br />
Bcryptjs, CORS, Dotenv, Express, Jsonwebtoken, Mongoose and Nodemon for dev

### Link to project: https://instagram-clone-elhan.netlify.app/

### .env for client

.env file for client folder contains the following enviromental variables: <br />
REACT_APP_LOCAL_URL= holds local url so I do not send requests to the hosted backend when developing

### .env for server

.env file for server folder contains the following enviromental variables: <br />
MONGO_URI= holds MongoDB connection string <br />
JWT_SECRET= holds 512-bit key generated using https://allkeysgenerator.com/ <br />
JWT_EXPIRE= holds JWT experation date, which in my case is 30d <br />
