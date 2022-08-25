const questions =[
    {
        id:1,
        question:'What does SQL stand for?',
        choices:[
         'strong question language',
         'structured question language',
         'structured query language'   
        ],
        answer:'structured query language'
    },
    {
        id:2,
        question:'Which SQL statement is used to extract data from a database?',
        choices:[
         'SELECT',
         'GET',
         'OPEN',
         'EXTRACT'   
        ],
        answer:'SELECT'
    },
    {
        id:3,
        question:'Which SQL statement is used to update data in a database?',
        choices:[
         'UPDATE',
         'SAVE AS',
         'SAVE' ,
         'MODIFY'  
        ],
        answer:'UPDATE'
    },
    {
        id:4,
        question:'Which SQL statement is used to delete data from a database?',
        choices:[
         'DELETE',
         'REMOVE',
         'COLLAPSE'  
        ],
        answer:'DELETE'
    },
    {
        id:5,
        question:'Which SQL statement is used to insert new data in a database?',
        choices:[
         'ADD NEW',
         'INSERT NEW',
         'ADD RECORD',
         'INSERT INTO'  
        ],
        answer:'INSERT INTO'
    },
    {
      id:6,
        question:'With SQL, how do you select a column named firstName?',
        choices:[
         'SELECT firstName FROM persons',
         'EXTRACT firstname FROM persons',
         'SELECT person.firstname',  
        ],
        answer:'SELECT firstname FROM persons'
    },
    {
        id:7,
          question:'With SQL, how do you select all the columns from a table named "Persons"?',
          choices:[
           'SELECT  persons',
           'SELECT[all]  FROM persons',
           'SELECT * FROM persons',
           'SELECT persons'  
          ],
          answer:'SELECT firstname FROM persons'
      },
      {
        id:8,
          question:'With SQL, how do you select all the records from a table named "Persons" where the value of the column "FirstName" is "Peter?"',
          choices:[
           'SELECT[all] FROM persons WHERE firstname="peter"',
           'SELECT * FROM persons WHERE firstname="peter"',
           'SELECT * FROM persons WHERE firstname<>peter',
           'SELECT[all] FROM persons WHERE firstname LIKE "peter"'  
          ],
          answer:'SELECT * FROM persons WHERE firstname="peter"'
      },
    {
      id:9,
      question:'With SQL, how do you select all the records from a table named "Persons" where the value of the column "FirstName" starts with an "a"?',
      choices:[
       'SELECT * FROM persons WHERE firstname="%a"',
       'SELECT * FROM persons WHERE firstname="a"',
       'SELECT * FROM persons WHERE firstname LIKE "%a"',
       'SELECT * FROM persons WHERE firstname LIKE "a%"'  
      ],
      answer:'SELECT * FROM persons WHERE firstname LIKE"a%"'
    },
    {
        id:10,
        question:'The OR operator displays a record if ANY conditions listed are true. The AND operator displays a record if ALL of the conditions listed are true',
        choices:[
         'true',
         'false',  
        ],
        answer:'true'
    }
]
export default questions 
