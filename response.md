# Response
## A. Required Information
### A.1. Requirement Completion Rate
- [x] List all pharmacies open at a specific time and on a day of the week if requested.
  ```
  - Get /pharmacies/openingHours
  ```
  - http://localhost:3000/api/v1/pharmacies/openingHours?time=14:00&day=Mon
- [x] List all masks sold by a given pharmacy, sorted by mask name or price.

  ```
  - Get /pharmacies/:pharmacyName/masks
  ```
  - http://localhost:3000/api/v1/pharmacies/DFW%20Wellness/masks?order=price
- [x] List all pharmacies with more or less than x mask products within a price range.
  ```
  - Get /pharmacies/stocks
  ```
  - http://localhost:3000/api/v1/pharmacies/stocks?num=3&priceRange=3.22-21.71
- [x] The top x users by total transaction amount of masks within a date range.
  ```
  - Get /users/trans/userTopList
  ```
  - http://localhost:3000/api/v1/users/trans/userTopList?top=3&dateRange=2021/01/05-2021/01/10
- [x] The total number of masks and dollar value of transactions within a date range.
  ```
  - Get /users/trans/totalAmount
  ```
  - http://localhost:3000/api/v1/users/trans/totalAmount?dateRange=2021/01/05-2021/01/10
- [x] Search for pharmacies or masks by name, ranked by relevance to the search term.
  ```
  - Get /search
  ```
  - http://localhost:3000/api/v1/searching?keyword=re
- [x] Process a user purchases a mask from a pharmacy, and handle all relevant data changes in an atomic transaction.
  ```
  - Post users/:userId/trans
  ```
### A.2. API Document
[Swagger API document](http://localhost:3000/api-docs/)

### A.3. Import Data Commands
Please run these two script commands to migrate the data into the database.
  > Pre-setting
  - Create MySQL database
  - Setting connection config in ./config/config.json
> Run Server
```bash
$ git clone https://github.com/Gincoolwant/phantom_mask.git
$ npm install
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
$ npm run start
```
 When the following words appear on the terminal, it means the execution is successful
 ```
 App is running on port 3000
 ```
## C. Other Information

### C.1. ERD

[ERD Link](https://drawsql.app/teams/kdan/diagrams/kdan).

### C.2. Technical Document
none

- --
