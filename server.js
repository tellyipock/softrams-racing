const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');
const { check, validationResult } = require('express-validator')

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.post('/api/addMember', [
  check('firstName', 'firstName is required and must be at least 3 letters long.')
    .exists()
    .isLength({ min: 3 }),
  check('lastName', 'firstName is required.')
    .exists(),
  check('team', 'team is required.')
    .exists(),
  check('status', 'status is required.')
    .exists()
], (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    const member = JSON.stringify(req.body);
    const httpOptions = {
      url: 'http://localhost:3000/members',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'},
      body: member
    };
    request(httpOptions, (err, response, body) => {
      if (response.statusCode <= 500) {
        res.status(200).send({'SUCCESS': true});
      }
    });
  }
  else {
    // return res.status(422).jsonp(errors.array())
    res.status(200).send({
      'SUCCESS': false,
      'ERROR': errors.array()
    });
  }
  
});

app.post('/api/editMember', [
  check('firstName', 'firstName is required and must be at least 3 letters long.')
    .exists()
    .isLength({ min: 3 }),
  check('lastName', 'firstName is required.')
    .exists(),
  check('team', 'team is required.')
    .exists(),
  check('status', 'status is required.')
    .exists()
], (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    const memberID = req.body.id;
    if(isNaN(memberID)) {
      res.status(200).send({
        'SUCCESS': false,
        'ERROR': 'Member ID not found'
      });
    }
    else {
      const member = JSON.stringify(req.body);
      const httpOptions = {
        url: `http://localhost:3000/members/${memberID}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'},
        body: member
      };
      request(httpOptions, (err, response, body) => {
        if (response.statusCode <= 500) {
          res.status(200).send({'SUCCESS': true});
        }
      });
    }
  }
  else {
    // return res.status(422).jsonp(errors.array())
    res.status(200).send({
      'SUCCESS': false,
      'ERROR': errors.array()
    });
  }
});

app.post('/api/deleteMember', (req, res) => {
  const memberID = req.body.id;
  const options = {
    url: `http://localhost:3000/members/${memberID}`,
    method: 'DELETE'
  }
  request(options, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.status(200).send({'SUCCESS': true});
    }
  });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
