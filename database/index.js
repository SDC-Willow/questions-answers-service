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

// Post a question
const insertQuestion = (questionObject, callback) => {
  const unixTimestamp = Date.now();
  const insertString = `
    INSERT
      INTO Questions
        (
          product_id,
          question_body,
          question_date,
          asker_name,
          asker_email,
          reported,
          question_helpfulness
        )
    VALUES
      (
        ${questionObject.product_id},
        '${questionObject.question_body}',
        ${unixTimestamp},
        '${questionObject.asker_name}',
        '${questionObject.asker_email}',
        0,
        0
      )`;
  connection.query(insertString, callback);
}

const insertAnswer = (answerObject, callback) => {
  const unixTimestamp = Date.now();
  const insertString = `
    INSERT
      INTO ANSWERS
        (
          question_id,
          body,
          date_written,
          answerer_name,
          answerer_email,
          reported,
          helpfulness
        )
      VALUES
        (
          ${answerObject.question_id},
          '${answerObject.body}',
          ${unixTimestamp},
          '${answerObject.answerer_name}',
          '${answerObject.answerer_email}',
          0,
          0
        )`;
  connection.query(insertString, callback);
}

const insertPhotos = (photosObject, callback) => {
  for (let i = 0; i < photosObject.photos.length; i++) {
    let insertString = `
      INSERT
        INTO PHOTOS
          (
            answer_id,
            url
          )
        VALUES
          (
            ${photosObject.answer_id},
            '${photosObject.photos[i]}'
          )`;
    if (i === photosObject.photos.length -1) {
      connection.query(insertString, callback);
    } else {
      connection.query(insertString);
    }
  }
};

const incrementQuestionHelpfulness = (questionId, callback) => {
  let incrementString = `
    UPDATE
      QUESTIONS
        SET
          question_helpfulness = question_helpfulness +1
        WHERE
          question_id = ${questionId}`;
  connection.query(incrementString, callback);
}

const reportQuestion = (questionId, callback) => {
  let reportString = `
    UPDATE
      QUESTIONS
        SET
          reported = true
        WHERE
          question_id = ${questionId}`;
  connection.query(reportString, callback);
}

const incrementAnswerHelpfulness = (answerId, callback) => {
  let incrementString = `
  UPDATE
    ANSWERS
      SET
        helpfulness = helpfulness + 1
      WHERE
        answer_id = ${answerId}`;
  connection.query(incrementString, callback);
}

const reportAnswer = (answerId, callback) => {
  let reportString = `
    UPDATE
      ANSWERS
        SET
          reported = true
        WHERE
          answer_id = ${answerId}`;
  connection.query(reportString, callback);
}

module.exports = {
  getQuestions,
  getAnswersPhotos,
  insertQuestion,
  insertAnswer,
  insertPhotos,
  incrementQuestionHelpfulness,
  reportQuestion,
  incrementAnswerHelpfulness,
  reportAnswer
};
