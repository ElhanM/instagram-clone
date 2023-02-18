# Instagram Clone 

A full-stack web application built using the MERN stack, featuring user authentication, API debouncing, pagination (implemented with React Query), and optimistic updates. Photo uploads are handled using the Cloudinary API.

## Video of the project

https://user-images.githubusercontent.com/103935603/211108305-136ea0bf-3917-4804-a55e-2d84834e921e.mp4

## External Libraries - Frontend

- Material UI
- Axios
- SCSS
- React Router Dom 6
- Universal Cookie
- React Loader Spinner
- React Query

## External Libraries - Backend

- Bcryptjs
- CORS
- Dotenv
- Express
- Jsonwebtoken
- Mongoose
- Nodemon (for development)

## Environmental Variables

### Client

- `REACT_APP_LOCAL_URL`: Holds the local URL for development, to prevent sending requests to the hosted backend.
- `REACT_APP_CLOUDINARY_API`: Holds the admin's Cloudinary API key.

### Server

- `MONGO_URI`: Holds the MongoDB connection string.
- `JWT_SECRET`: Holds a 512-bit key generated using https://allkeysgenerator.com/.
- `JWT_EXPIRE`: Holds the JWT expiration date (set to 35 days in my case).

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:ElhanM/instagram-clone.git
```

2. Go to the client folder and run the following commands:

```bash
cd client
cp .env.example .env
yarn install && yarn start or npm install && npm start
```

3. Do the same for the server folder:

```bash
cd server
cp .env.example .env
yarn install && yarn dev or npm install && npm run dev
```

## Dont forget to update the .env files!

## License
[MIT](https://choosealicense.com/licenses/mit/)
