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
    db.getQuestions(req.query.product_id, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        let newdata = result;
        let photosarray = [];
        const step1 = new Promise((resolve, reject) => {
          let array = result;
          for (let i = 0; i < array.length; i ++) {
            // let placeholder = array[i].answers.slice(1, array[i].answers.length- 1)
            let placeholder = JSON.parse(array[i].answers);
            array[i].answers = placeholder;
          }
          newdata = result
          resolve(result);
        });

        const step2 = () => {
          let allQuestionIds = [];
          for (let j = 0; j < result.length; j++) {
            let answerids = Object.keys(result[j].answers);
            for (let m = 0; m < answerids.length; m++) {
              allQuestionIds.push(answerids[m]);
            }
          }

          return allQuestionIds;
        }

        const step3 = (allQuestionIds) => {

          for (let n = 0; n < allQuestionIds.length; n++) {
            db.getAnswersPhotos(parseInt(allQuestionIds[n]), (error, data) => {
              if (error) {
                console.log(error);
              } else {
                // console.log('🐥', allQuestionIds[n], ': ', data);
                let urlArray = data.map((item) => {
                  return item.url;
                })
                photosarray = urlArray;
                if (urlArray.length > 0) {
                  for (let p = 0; p < result.length; p++) {
                    // console.log(result[p].answers['10'])
                    let current = allQuestionIds[n];
                    // console.log('🦋', result[p].answers[current].body)
                    if (result[p].answers[current]) {
                      // console.log('🦋', result[p].answers[current].body)
                      newdata[p].answers[current].photos = urlArray;
                      console.log('🐝', newdata[p].answers[current].photos);
                    }
                  }
                }

              }
            })
          }
          // resolve(result);
        }

        step1
          .then((data) => {
            return step2();
          })
          .then((data) => {
            return step3(data);
          })
          .then((data) => {
            console.log('photosarray', photosarray)
            res.send({product_id: req.query.product_id, results: newdata})

          })
          // .then((array) => {

          // })




        // console.log('this is req product id', result[0].answers);
      }
    });
  } else {
    res.end('Error: invalid product_id provided');
  }
})

// GET Answers
// GET /qa/questions/:question_id/answers
app.get('/qa/questions', (req, res) => {
  // db.getQuestions((error, result) => {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     console.log(result);
  //   }
  // });
})

app.listen(port, () => {
  console.log(`Questions and Answers Service listening at http://localhost:${port}`)
})


