const express = require('express')
const app = express()
const port = 3000
const db = require('../database');
const bodyParser = require('body-parser');

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
  // db.getQuestions((error, result) => {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     console.log(result);
  //   }
  // });
})

// POST Answer

app.post(`/qa/questions/:question_id/answers`, (req, res) => {

})

// PUT Mark Question as Helpful

app.put(`/qa/questions/:question_id/helpful`, (req, res) => {

})


// PUT Report Question

app.put(`/qa/questions/:question_id/report`, (req, res) => {

})

// PUT Mark Answer as Helpful

app.put(`/qa/answers/:answer_id/helpful`, (req, res) => {

})

// PUT Report Answer

app.put(`/qa/answers/:answer_id/report`, (req, res) => {

})


app.listen(port, () => {
  console.log(`Questions and Answers Service listening at http://localhost:${port}`)
})


