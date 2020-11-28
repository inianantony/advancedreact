# Advanced React & GraphQL

## Introduction & Setup

### Preliminary Steps

* The `bootstrap` folder contains the base version without any changes applied. So its the bare repo to begin with if a new try has to be performed
* The `sick-fits` folder is the working directory and contains the `frontend` and `backend` code
* Each the `backend` and `frontend` folder has `.vscode` setting folder that changes the title bar color to differentiate so open those folders in two separate windows
* Do an npm install in both folders

### Application introduction of e-commerce application

* The application has a landing page with items to sell
* Add new items to sell
* Add to cart and update the cart
* Search for items and add to cart
* Add payment details to buy
* Order page showing new and past orders
* Also my account page

### Tech Stack

#### Frontend

* React
* Next.js -> initial tooling and bundling, routing, framework to do server rendering , pagination, overall layout
* Apollo Client -> manage local state with graphQL, caching, local state

#### Backend

* MySQL
* Prisma -> database interface layer, GraphQL layer
* GraphQL Yoga -> backend processing layer before store into database

### First Page

* pages are just js files
* create `index.js` file inside the `pages` folder
* Add code for react first component and page by following the git commit
* The below steps will help in creating accounts in 3rd party services which are needed in the application at various steps

### Create account in Prisma

* create an account in prisma https://app.prisma.io/
* globally install prisma `npm i -g prisma`
* `prisma login` and grant permission
* `prisma init` inside the backend folder
* Choose demo server and the region, also give a service name and stage as `dev`. choose `dont generate` for the programming language
* prisma will auto download the `prisma.yml` file and the `datamodel` file
* Update the yml file and datamodel.prisma file according to the commit

### Upload image to cloudinary.com

* Create an account in cloudinary.com
* Go to settings -> Upload -> Add upload preset
* Give upload preset name and folder name as sickfits and set signed mode as unsigned
* On the upload manipulations tab -> set incoming transformation , resize width as 500 & Format quality as auto
* Set eager transformation resize width as 1000 & Format quality as auto

### Sent a test mail using https://mailtrap.io/

* Create an account in https://mailtrap.io/
* This mail server can be used to test the email sending logic
* Take note of the smtp server settings and update in the variables.env file
  