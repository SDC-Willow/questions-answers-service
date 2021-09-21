const db = require('../database');


describe('Basic test', () => {
  it('adds 1 + 2 to equal 3', () => {
    const sum = (a, b) => {
      return a + b;
    };
    expect(sum(1, 2)).toBe(3);
  });
});

describe('server is able to return data from the database', () => {

  it('data is being returned from the sql database', () => {
    let data;
    db.getQuestions(1, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        data = result;
      }
    });
    expect(data.length).toBe(5);
  });

});