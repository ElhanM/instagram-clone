# Instagram clone

Fullstack web app made using the MERN stack with user authentication, API debouncing, pagination (infinite scroll done with React Query) and optimistic updates

Photo upload is done with Cloudinary API

<hr>

## External libraries used for frontend: <br />

Material UI, Axios, SCSS, React Router Dom 6, Universal cookie, React Loader Spinner, React Query

## External libraries used for backend: <br />

Bcryptjs, CORS, Dotenv, Express, Jsonwebtoken, Mongoose and Nodemon for dev

## .env for client

.env file for client folder contains the following enviromental variables: <br />
REACT_APP_LOCAL_URL= holds local url so I do not send requests to the hosted backend when developing
REACT_APP_CLOUDINARY_API = holds admin's Cloudinary API Environment variable

## .env for server

.env file for server folder contains the following enviromental variables: <br />
MONGO_URI= holds MongoDB connection string <br />
JWT_SECRET= holds 512-bit key generated using https://allkeysgenerator.com/ <br />
JWT_EXPIRE= holds JWT experation date, which in my case is 30d <br />

## Video of the project

https://user-images.githubusercontent.com/103935603/211108305-136ea0bf-3917-4804-a55e-2d84834e921e.mp4

## Get Started

To set up the app, clone the repository:

```bash
git clone git@github.com:ElhanM/instagram-clone.git
```

execute the following commands for client:

```bash
cd client
cp .env.example .env
yarn install && yarn start or npm install && npm start
```

and for server:

```bash
cd server
cp .env.example .env
yarn install && yarn dev or npm install && npm run dev
```

Dont forget to update the .env files

## License
[MIT](https://choosealicense.com/licenses/mit/)
