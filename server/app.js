const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");
app.use(cors());
const md5 = require('js-md5');
const uuid = require('uuid');
const mysql = require("mysql");
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fundmeapp",
});

////////////////////LOGIN/////////////////




const doAuth = function(req, res, next) {
    if (0 === req.url.indexOf('/server')) { // admin
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length || results[0].role !== 10) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login')|| 0 === req.url.indexOf('/register')) {
        next();
    } else { // fron
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    }
}

app.use(doAuth);

// AUTH
app.get("/login-check", (req, res) => {
    const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
    con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
        if (err) throw err;
        if (!result.length) {
            res.send({ msg: 'error', status: 1 }); // user not logged
        } else {
            if ('admin' === req.query.role) {
                if (result[0].role !== 10) {
                    res.send({ msg: 'error', status: 2 }); // not an admin
                } else {
                    res.send({ msg: 'ok', status: 3 }); // is admin
                }
            } else {
                res.send({ msg: 'ok', status: 4 }); // is user
            }
        }
    });
});

app.post("/login", (req, res) => {
    const key = uuid.v4();
    const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
    con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
        if (err) throw err;
        if (!result.affectedRows) {
            res.status(401).send({ msg: 'error', key: '' });
        } else {
            res.send({ msg: 'ok', key, text: 'Thanks for coming back ' + req.body.user + ' ! :)', type: 'info' });
        }
    });
});

app.post("/register", (req, res) => {
    const key = uuid.v4();
    const sql = `
    INSERT INTO users (name, psw, session)
    VALUES (?, ?, ?)
  `;
    con.query(sql, [req.body.name, md5(req.body.pass), key], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'ok', key, text: 'Welcome to our world!', type: 'info' });
    });
});

///////////////////END////////////////////

//CREATE STORY for user
app.post("/home/storiesu", (req, res) => {
    const sql = `
    INSERT INTO stories (title, text, sum, sum_balance, image)
    VALUES (?, ?, ?, ?, ?)
    `;
    con.query(sql, [req.body.title, req.body.text, req.body.sum, req.body.sum_balance, req.body.image], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'A new story has been added.', type: 'success' });
    });
});

// CREATE DONATION for user

app.post("/home/donations", (req, res) => {
    const sql = `
      INSERT INTO list (name, amount, story_id)
      VALUES (?, ?, ?)
      `;
    con.query(
      sql,
      [req.body.name, req.body.amount, req.body.story_id],
      (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thank you for your donation!.', type: 'success' });
      }
    );
  });

// READ stories for user
app.get("/home/storiesu", (req, res) => {
    const sql = `
    SELECT *
    FROM stories
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ stories for admin
app.get("/home/storiesa", (req, res) => {
    const sql = `
    SELECT *
    FROM stories
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ STORIES for home

app.get("/home/stories-home", (req, res) => {
    const sql = `
    SELECT s.*, l.id AS lid, l.name, l.amount
      FROM stories AS s
      LEFT JOIN list AS l
      ON l.story_id = s.id
      WHERE s.status = 1
      ORDER BY s.id
      `;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });




//DELETE a story for user
app.delete("/home/storiesu/:id", (req, res) => {
    const sql = `
    DELETE FROM stories
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The story has been deleted.', type: 'info' });
    });
});

//Delete a story for admin
app.delete("/home/stories/:id", (req, res) => {
    const sql = `
    DELETE FROM stories
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Unappropriate story has been deleted.', type: 'info' });
    });
});




//EDIT a story for user
app.put("/home/storiesu/:id", (req, res) => {
    let sql;
    let r;
    if (req.body.deletePhoto) {
        sql = `
        UPDATE stories
        SET title = ?, text = ?, sum = ?, sum_balance = ?, image = null
        WHERE id = ?
        `;
        r = [req.body.title, req.body.text, req.body.sum, req.body.sum_balance, req.params.id];
    } else if (req.body.image) {
        sql = `
        UPDATE stories
        SET title = ?, text = ?, sum = ?, sum_balance = ?, image = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.text, req.body.sum, req.body.sum_balance, req.body.image, req.params.id];
    } else {
        sql = `
        UPDATE stories
        SET title = ?, text = ?, sum = ?, sum_balance = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.text, req.body.sum, req.body.sum_balance, req.params.id]
    }
    con.query(sql, r, (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The story has been edited.', type: 'success' });
    });
});

// UPDATE story for admin - APPROVE

app.put("/home/storiesa/:id", (req, res) => {
  const sql = `
    UPDATE stories
    SET status = ?
    WHERE id = ?
    `;
  con.query(sql, [req.body.status, req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ msg: 'OK', text: 'The story has been approved.', type: 'success' });
  });
});

// UPDATE story after adding a donation

app.put("/home/stories-donation/:id", (req, res) => {
    const sql = `
      UPDATE stories
      SET 
      sum_now = sum_now + ?,
      sum_balance = sum - sum_now
      WHERE id = ?
      `;
    con.query(sql, [req.body.amount, req.params.id], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

app.listen(port, () => {
    console.log(`Filmus rodo per ${port} portą!`)
});






// // READ
// // SELECT column1, column2, ...
// // FROM table_name;

// // app.get("/trees/:tipas", (req, res) => {

// //     // console.log(req.query.sort);

// //     const sql = `
// //     SELECT id, type, title, height
// //     FROM trees
// //     WHERE type = ? OR type = ?
// //     `;
// //     con.query(sql, [req.params.tipas, req.query.sort], (err, result) => {
// //         if (err) throw err;
// //         res.send(result);
// //     });
// // });

// // INNER JOIN
// // SELECT column_name(s)
// // FROM table1
// // INNER JOIN table2
// // ON table1.column_name = table2.column_name;
// app.get("/get-it/inner-join", (req, res) => {
//     const sql = `
//     SELECT c.id, p.id AS pid, name, phone
//     FROM clients AS c
//     INNER JOIN phones AS p
//     ON c.id = p.client_id
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.get("/get-it/left-join", (req, res) => {
//     const sql = `
//     SELECT c.id, p.id AS pid, name, phone
//     FROM clients AS c
//     LEFT JOIN phones AS p
//     ON c.id = p.client_id
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.get("/get-it/right-join", (req, res) => {
//     const sql = `
//     SELECT c.id, p.id AS pid, name, phone
//     FROM clients AS c
//     RIGHT JOIN phones AS p
//     ON c.id = p.client_id
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });





// // READ (all)
// app.get("/trees", (req, res) => {
//     const sql = `
//     SELECT id, type, title, height
//     FROM trees
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //CREATE
// // INSERT INTO table_name (column1, column2, column3, ...)
// // VALUES (value1, value2, value3, ...);
// app.post("/trees", (req, res) => {
//     const sql = `
//     INSERT INTO trees (title, height, type)
//     VALUES (?, ?, ?)
//     `;
//     con.query(sql, [req.body.title, req.body.height, req.body.type], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });


// //DELETE
// // DELETE FROM table_name WHERE condition;
// app.delete("/trees/:id", (req, res) => {
//     const sql = `
//     DELETE FROM trees
//     WHERE id = ?
//     `;
//     con.query(sql, [req.params.id], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });


// //EDIT
// // UPDATE table_name
// // SET column1 = value1, column2 = value2, ...
// // WHERE condition;
// app.put("/trees/:id", (req, res) => {
//     const sql = `
//     UPDATE trees
//     SET title = ?, height = ?, type = ?
//     WHERE id = ?
//     `;
//     con.query(sql, [req.body.title, req.body.height, req.body.type, req.params.id], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });