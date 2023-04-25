<div id="top"></div>

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <img src="src/assets/logo.svg" alt="Logo">
</div>

<!-- TABLE OF CONTENTS -->

## Contents

<p align="center">
    <p><a href="#about-the-project" title=" go to About the Project">About The Project</a></p>
    <p><a href="#-running-locally" title=" go to Running locally">Running locally</a></p>
    <p><a href="#-prints-e-layout" title=" go to Prints e Layout">Prints and Layout</a></p>
    <p><a href="#-technologies-used" title=" go to Technologies Used">Technologies Used</a></p>
    <p><a href="#-contact" title=" go to Contact">Contact</a></p>
  </p>

<br>
<!-- ABOUT THE PROJECT -->

# 💡About The Project

Marketspace App using React Native! Challenge project of React Native Ignite from Rocketseat.
All the project information and the rules that the challenge has to follow, is in this link: https://efficient-sloth-d85.notion.site/Desafio-03-Marketspace-39a72342e820424aaa12d7713ab1d175

## API structure

The API for this challenge was structured following the same idea as the API used in the Ignite Gym project. To better understand the structure and functioning of the API, you have a few options:

- Swagger: As with the API available in the class, you can access the documentation we created with Swagger, just run the API and access the `http://localhost:3333/docs/` route
- Beekeeper: Just like in the classes, we recommend using Beekeeper to visualize the database data.
- Prisma Studio: If you prefer another way of viewing the database data, just access your API folder through the terminal and run the command `npx prisma studio`. That way, you will be able to see the tables and records in the url `http://localhost:5555/`
- Insomnia/Postman: If you want to interact with the API in a very direct and easy way, you can use an API Rest Client like Insomnia or Postman.
  `<br>`

# 📱 Running locally

```bash
# Clone this repository
$ git clone https://github.com/bielpatricio/marketspace
# Access the project folder in your terminal
$ cd ignite_gym
# Install the dependencies
$ npm i
# Run the application in development mode
$ expo start or npx expo start
# The application will runing, so you will have to open the `Expo Go` app on your smartphone 
# and read the QR Code on your terminal

# The backend was not built by me, so we took it from the other repository
$ git clone https://github.com/rocketseat-education/ignite-rn-2022-challenge-marketspace-api.git
# To run the back-end you need install the dependencies 
$ npm i
# And run the api with `npm start` or
$ npm run dev
# The api will start on port:3333.
# The docs can be access on localhost:3333/api-docs/

# The database was created with prisma, so you can see all database running, if you use android studio, you cant run prisma on port 5555
$ npx prisma studio --port 5556
# The database will open on http://localhost:5556/.
```

# 🖼 Prints e Layout

The application layout is available on Figma:

<a href="https://www.figma.com/file/r2gfVHrqbvjsf7W8METTLg/Marketspace-(Copy)?t=m2vQokEltp2CG8D5-0">
  <img alt="Made by rocketseat" src="https://img.shields.io/badge/Acessar%20Layout%20-Figma-%2304D361">
</a>
<br>

<p align="center">

</p>

<br>
<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <br>

<br>

# 💻 Technologies Used

 ![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![image](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![image](https://img.shields.io/badge/Expo-FFFFFF?style=for-the-badge&logo=expo&logoColor=black)
<br>
<br>

# 💻 Contact

Gabriel Patrício - gabrieltp087@gmail.com - [https://github.com/bielpatricio/](https://github.com/bielpatricio)

<p align="right">(<a href="#top">back to top</a>)</p>
