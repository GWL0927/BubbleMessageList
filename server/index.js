var express = require('express')
var mysql = require('mysql')
var app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

var pool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'wall'
})

function query(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
  })
}

app.get('/', async function(req, res) {
  await query('SELECT * FROM tags').then(function (result) {
    var str = "";
    str = JSON.stringify(result)
    res.send(str)
    console.log('加载成功');
  })
})

app.post('/add', async function (req, res) {
  var id = req.body.tid
  var message = req.body.tmessage
  var name = req.body.tname
  await query(`insert tags (id,message,likes,dislikes,name) values (${id}, "${message}", 0, 0, "${name}")`).then(() => {
    console.log('添加成功');
  })
})

app.post('/likes', async function (req, res) {
  var id = req.body.tid
  var likes = req.body.tlikes
  await query(`update tags set likes = ${likes}  where id = ${id}`).then(() => {
    console.log('点赞成功');
  })
})

app.post('/dislikes', async function (req, res) {
  var id = req.body.tid
  var dislikes = req.body.tdislikes
  await query(`update tags set dislikes = ${dislikes}  where id = ${id}`).then(() => {
    console.log('点踩成功');
  })
})

app.post('/delete', async function (req, res) {
  var id = req.body.tid
  await query(`delete from tags where id = ${id}`).then(() => {
    console.log('删除成功');
  })
})

app.listen(3000, function() {
  console.log('http://localhost:3000/');
})