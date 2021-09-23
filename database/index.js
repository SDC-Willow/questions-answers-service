const mysql = require('mysql');
const mysqlConfig = require('./config.js');
const $ = require('jquery');

const connection = mysql.createConnection(mysqlConfig);

const getQuestions = (productId, callback) => {

  let newdata;
  let photosarray = [];
  let allQuestionIds = [];

  let questions = `
  SELECT
    question_id,
    question_body,
    question_date,
    asker_name,
    question_helpfulness,
    reported,
    (
      SELECT JSON_OBJECTAGG(
        Answers.answer_id, (JSON_OBJECT(
          'id', answer_id,
          'body', body,
          'date', date_written,
          'answerer_name', answerer_name,
          'helpfulness', helpfulness,
          'photos', (JSON_ARRAY())
        ))
      )
      FROM Answers
      WHERE question_id = Questions.question_id
    ) AS answers
  FROM Questions
  WHERE product_id = ${productId} AND reported = 0;`;

  // console.log(connection.query(questions))
  connection.query(questions, (error, result) => {
    if (error) {
      console.log(error)
    } else {
      newdata = result;

      for (let i = 0; i < newdata.length; i ++) {
        if (newdata[i].answers !== null) {
          let placeholder = JSON.parse(newdata[i].answers);
          newdata[i].answers = placeholder;
        }
      }

      for (let j = 0; j < result.length; j++) {
        if (result[j].answers !== null) {
          let answerids = Object.keys(result[j].answers);
          for (let m = 0; m < answerids.length; m++) {
            allQuestionIds.push(answerids[m]);
          }
        }
      }

      // console.log(allQuestionIds)
      callback(newdata, allQuestionIds)
    }
  });

};

const getAnswersPhotos = (answerIds, callback) => {
  let answersPhotos = `
  SELECT
    url
  FROM Photos
  WHERE answer_id = ${answerIds}`;

  // console.log('🐽', connection.query(answersPhotos))
  connection.query(answersPhotos, callback);
};

module.exports = {
  getQuestions,
  getAnswersPhotos
};
