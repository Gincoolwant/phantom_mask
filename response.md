# Response
> Current content is an example; please edit it to fit your style.
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

```bash
$ rake import_data:pharmacies[PATH_TO_FILE]
$ rake import_data:users[PATH_TO_FILE]
```
## B. Bonus Information

>  If you completed the bonus requirements, please fill in your task below.
### B.1. Test Coverage Report

I wrote down the 20 unit tests for the APIs I built. Please check the test coverage report at [here](#test-coverage-report).

You can run the test script by using the command below:

```ruby
bundle exec rspec spec
```

### B.2. Dockerized
Please check my Dockerfile / docker-compose.yml at [here](#dockerized).

On the local machine, please follow the commands below to build it.

```bash
$ docker build --build-arg ENV=development -p 80:3000 -t my-project:1.0.0 .  
$ docker-compose up -d

# go inside the container, run the migrate data command.
$ docker exec -it my-project bash
$ rake import_data:pharmacies[PATH_TO_FILE]
$ rake import_data:user[PATH_TO_FILE]
```

### B.3. Demo Site Url

The demo site is ready on [heroku](#demo-site-url); you can try any APIs on this demo site.

## C. Other Information

### C.1. ERD

My ERD [erd-link](#erd-link).

### C.2. Technical Document

For frontend programmer reading, please check this [technical document](technical-document) to know how to operate those APIs.

- --
