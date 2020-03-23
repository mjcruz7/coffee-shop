# coffee-shop

NodeJS REST Server for coffee-shop

## Getting Started

Configure your environment vars before run the server.

To use upload service you need to create the following dir structure

```
 - project
    |__ src
    |__ public
    |__ UPLOAD_FOLDER
        |__ USER_IMAGE_FOLDER
        |__ PRODUCT_IMAGE_FOLDER
```

### Prerequisites

* NodeJS
* MongoDB
* Heroku CLI (Optional)

### Installing

Install npm dependencies

```
npm install
```

After node dependencies installation, run the REST Server

```
node app
```

## Running the tests

TBD

## Deployment

* [Heroku](https://heroku.com/apps) - Used to deploy the REST Server

## Built With

* [Node.js](https://nodejs.org/)

## Main Dependencies
* [express](https://expressjs.com/) - Dependency for run REST Server
* [mongoose](https://mongoosejs.com/) - Used to connect and work with MongoDB
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) - Used to create and validate tokens
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) - Used to encrypt passwords

## Contributing

TBD

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/mjcruz7/coffee-shop/tags). 

## Authors

* **Malco Jesse Cruz Santos** - *Initial work* - [mjcruz7](https://github.com/mjcruz7)

See also the list of [contributors](https://github.com/mjcruz7/coffee-shop/contributors) who participated in this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* **Fernando Herrera** - Udemy Teacher - [Klerith](https://github.com/Klerith)