const mysql = require('mysql');
const mysqlConfig = require('./config.js');
const $ = require('jquery');

const connection = mysql.createConnection(mysqlConfig);

const getQuestions = (productId, callback) => {
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
          'photos', (JSON_ARRAY('links', 'url1', 'url2', 'url3'))
        ))
      )
      FROM Answers
      WHERE question_id = Questions.question_id
    ) AS answers
  FROM Questions
  WHERE product_id = ${productId} AND reported = 0;`;

  // console.log(connection.query(questions))
  connection.query(questions, callback);
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
