# Authenticate_assignment

## Steps to run the assignment

### Api Tests using playwright and ui tests

1) clone this repository
2) the ui tests about price comparison on both platforms are located at tests/uitests.spec.ts
3) the api tests are performed on restbooker demo site and 
    are automated using playwright and postman.
    api tests using playwright located at  tests/apitest.spec.ts
4) the api tests are also written using postman 
    and are located at postman-collection 
    it can be imported using postman and can be executed.
5) the performance tests are written using jmeter and are located at
    jmeter-perf-tests.
6) to run both api tests and ui tests using playwright follow instruction below
    (a) clone this repository
    (b) run command --> npm install
    (c) after node modules folder is created 
        we need to install browsers
        run command npx playwright --> npx playwright install
    (d) to run tests run command --> npx playwright test