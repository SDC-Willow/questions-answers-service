const express = require('express')
const app = express()
const port = 3000
const db = require('../database');
const bodyParser = require('body-parser');

// caching all routes
const apicache = require('apicache');
let cache = apicache.middleware;
app.use(cache('5 minutes'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// GET Questions
// '/qa/questions?product_id=47421'
// if not product id is provided give this error "Error: invalid product_id provided"

app.get('/qa/questions', (req, res) => {
  if (req.query.product_id) {
    db.getQuestions(req.query.product_id, (questionsTable, idTable) => {
      let newdata = questionsTable;

      const addPhotoUrlsToAnswers = (allQuestionIds, callback) => {
        let totalQuestions = allQuestionIds.length - 1;

        for (let n = 0; n < allQuestionIds.length; n++) {
          db.getAnswersPhotos(parseInt(allQuestionIds[n]), (error, data) => {
            if (error) {
              console.log(error);
            } else {
              let urlArray = data.map((item) => {
                return item.url;
              })
              photosarray = urlArray;
              if (urlArray.length > 0) {
                for (let p = 0; p < newdata.length; p++) {
                  let current = allQuestionIds[n];
                  if (newdata[p].answers !== null) {
                    if (newdata[p].answers[current]) {
                      newdata[p].answers[current].photos = urlArray;
                      // console.log('🐝', newdata[p].answers[current]);
                    }
                  }
                }
              }
              if (n === totalQuestions) {
                callback(newdata)
              }
            }
          })
        }
      }

      addPhotoUrlsToAnswers(idTable, (completeTable) => {
        res.send({product_id: req.query.product_id, results: completeTable})
      })
    })
  } else {
    res.end("Error: invalid product_id provided");
  }
})


// POST Questions

app.post('/qa/questions', (req, res) => {

  const bodyData = {
    product_id: req.body.product_id,
    question_body: req.body.body,
    asker_name: req.body.name,
    asker_email: req.body.email
  }

  db.insertQuestion(bodyData, (error, result) => {
    if (error) {
      console.log(error)
      res.status(422).send('Error: Question body contains invalid entries');
    } else {
      res.sendStatus(201);
    }
  });
})

// POST Answer

app.post(`/qa/questions/:question_id/answers`, (req, res) => {
  const questionId = parseInt(req.params.question_id);
  const answerData = {
    question_id: questionId,
    body: req.body.body,
    answerer_name: req.body.name,
    answerer_email: req.body.email,
    photos: req.body.photos
  }
  if (req.body.body) {
    db.insertAnswer(answerData, (error, result) => {
      if (error) {
        console.log(error);
        res.status(422).send('Error: Answer body contains invalid entriesusername text is required,email must be valid');
      } else {
        if (req.body.photos.length > 0) {
          let data = {
            photos: req.body.photos,
            answer_id: result.insertId,
          }
          db.insertPhotos(data, (error, result) => {
            if (error) {
              console.log('🎃', error);
            } else {
              res.sendStatus(201);
            }
          })
        } else {
          res.sendStatus(201);
        }
      }
    })
  } else {
    res.status(422).send('Error: Answer body contains invalid entriesusername text is required,email must be valid');
  }
})

// PUT Mark Question as Helpful

app.put(`/qa/questions/:question_id/helpful`, (req, res) => {
  let questionId = parseInt(req.params.question_id);
  db.incrementQuestionHelpfulness(questionId, (error, result) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
})


// PUT Report Question

app.put(`/qa/questions/:question_id/report`, (req, res) => {
  let questionId = parseInt(req.params.question_id);
  db.reportQuestion(questionId, (error, result) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
})

// PUT Mark Answer as Helpful

app.put(`/qa/answers/:answer_id/helpful`, (req, res) => {
  let answerId = parseInt(req.params.answer_id);
  db.incrementAnswerHelpfulness(answerId, (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
})

// PUT Report Answer

app.put(`/qa/answers/:answer_id/report`, (req, res) => {
  let answerId = parseInt(req.params.answer_id);
  db.reportAnswer(answerId, (error, result) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
})

// loader.io

app.get('/loaderio-597c9deecf9c4d42dc36e0c53aa75564.txt', (req, res) => {
  const options = {
      root: path.join('../', __dirname)
  };

  const fileName = 'loaderio-597c9deecf9c4d42dc36e0c53aa75564.txt';
  res.sendFile(fileName, options, (err) => {
      if (err) {
          console.log(err);
      } else {
          console.log('Sent:', fileName);
      }
  });
});


app.listen(port, () => {
  console.log(`Questions and Answers Service listening at http://localhost:${port}`)
})


