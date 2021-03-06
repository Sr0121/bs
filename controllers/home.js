// home:

var fs = require('fs');
var path = require('path');

var home_html = async (ctx, next) => {
    ctx.response.type = 'text/html';
    ctx.response.status = 200;
    ctx.response.body = fs.readFileSync(path.resolve(__dirname, '..') + '/views/home.html');
    await next();
};

var home_info = async (ctx, next) => {
    var id = ctx.cookies.get('uid');
    var today = new Date(new Date().toLocaleDateString()).getTime();
    var map = new Map();
    var database = require('./load_database.js')();
    var req = 'select * from user_table where id = ?';

    var row = await database.query(req, [id]);
    if (row.length == 0) {
        map['state'] = 'FAILURE';
    }
    else {
        map['state'] = 'SUCCESS';
        map['id'] = row[0]['id'];
        map['user_name'] = row[0]['user_name'];
        map['user_icon'] = row[0]['user_icon'];
        map['password'] = row[0]['password'];
        map['email'] = row[0]['email'];
        map['level_4'] = row[0]['level_4'];
        map['level_6'] = row[0]['level_6'];
        map['toefl'] = row[0]['toefl'];
        map['IELTS'] = row[0]['IELTS'];
        map['level_4_total'] = row[0]['level_4_total'];
        map['level_4_learned'] = row[0]['level_4_learned'];
        map['level_4_review_target'] = row[0]['level_4_review_target'];
        map['level_4_review_learned'] = row[0]['level_4_review_learned'];
        map['level_4_left'] = row[0]['level_4_left'];
        map['level_6_total'] = row[0]['level_6_total'];
        map['level_6_learned'] = row[0]['level_6_learned'];
        map['level_6_review_target'] = row[0]['level_6_review_target'];
        map['level_6_review_learned'] = row[0]['level_6_review_learned'];
        map['level_6_left'] = row[0]['level_6_left'];
        map['toefl_total'] = row[0]['toefl_total'];
        map['toefl_learned'] = row[0]['toefl_learned'];
        map['toefl_review_target'] = row[0]['toefl_review_target'];
        map['toefl_review_learned'] = row[0]['toefl_review_learned'];
        map['toefl_left'] = row[0]['toefl_left'];
        map['IELTS_total'] = row[0]['IELTS_total'];
        map['IELTS_learned'] = row[0]['IELTS_learned'];
        map['IELTS_review_target'] = row[0]['IELTS_review_target'];
        map['IELTS_review_learned'] = row[0]['IELTS_review_learned'];
        map['IELTS_left'] = row[0]['IELTS_left'];

        if(row[0]['level_4_review_submission_date'] < today){
            map['level_4_learned'] = 0;
            map['level_4_review_learned'] = 0;
            database.query("update user_table set level_4_learned = 0 , level_4_review_learned = 0 where id = ?", [id]);
        }
        if(row[0]['level_6_review_submission_date'] < today){
            map['level_6_learned'] = 0;
            map['level_6_review_learned'] = 0;
            database.query("update user_table set level_6_learned = 0 , level_6_review_learned = 0 where id = ?", [id]);
        }
        if(row[0]['toefl_review_submission_date'] < today){
            map['toefl_learned'] = 0;
            map['toefl_review_learned'] = 0;
            database.query("update user_table set toefl_learned = 0 , toefl_review_learned = 0 where id = ?", [id]);
        }
        if(row[0]['IELTS_review_submission_date'] < today){
            map['IELTS_learned'] = 0;
            map['IELTS_review_learned'] = 0;
            database.query("update user_table set IELTS_learned = 0 , IELTS_review_learned = 0 where id = ?", [id]);
        }
    }
    ctx.response.status = 200;
    ctx.response.type = 'application/json';
    ctx.response.body = JSON.stringify(map);

    await next();
};

var home_change = async (ctx, next) => {
    var database = require('./load_database.js')();
    var map = new Map();
    // ctx.cookies.set('uid', id, {expires: new Date(timestamp)});
    //当用户更改目标变小时使用
    var req = 'SELECT * from user_table WHERE id=' + ctx.cookies.get('uid') + ';';
    console.log(req);
    var row = await database.query(req);
    var target = row[0][ctx.request.body.type];
    var total = row[0][ctx.request.body.type + '_total'];
    var learned = row[0][ctx.request.body.type + '_learned'];
    var left = row[0][ctx.request.body.type + '_left'];
    var review_learned = row[0][ctx.request.body.type + '_review_learned'];
    var review_target = row[0][ctx.request.body.type + '_review_target'];



    req = 'UPDATE user_table SET ' + ctx.request.body.type + '=' + ctx.request.body.num + ' , '
        + ctx.request.body.type + '_review_target = ' + Math.floor(ctx.request.body.num * 1.5)
        + ' WHERE id=' + ctx.cookies.get('uid') + ';';
    console.log(req);
    row = await database.query(req);

    await next();
};

module.exports = {
    'GET /home': home_html,
    'GET /home/info': home_info,
    'POST /home/change': home_change
};
