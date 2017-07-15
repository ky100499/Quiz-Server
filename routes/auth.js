var router = require("express").Router();
var http = require("http");
var util = require("util");

router.route("/login/")
    .get(function(req, res) {
        var sess = req.session;

        if (sess.user_id) {
            res.redirect("/");

        } else {

            res.render("base", {
                "title": "Login",
                "msg": "",
                "active": "login",
                "user_idx": req.session.user_idx,
                "user_name": req.session.user_name,
                "page_include": "./auth/login"
            });
        }
    })
    .post(function(req, res) {
        var sess = req.session;

        var userid = req.body.id,
            userpwd = req.body.pwd;

        var options = {
            "hostname": "api.dimigo.org",
            "path": "/v1/users/identify?username="+userid+"&password="+userpwd,
            "headers": {
                'Authorization': 'Basic ' + (new Buffer("enoxaiming:hkw003")).toString('base64')
            }
        };

        http.request(options, function(data) {
            data.setEncoding('utf8');
            if (data.statusCode == 200) {
                data.on('data', function (body) {
                    if (typeof body !== "object") body = JSON.parse(body);

                    sess.user_idx = body.id;
                    sess.user_id = body.username;
                    sess.user_name = body.name;
                    sess.user_type = body.user_type;

                    res.redirect("/");
                });
            } else {
                res.redirect("/auth/login");
            }
        }).end();
    });

router.get("/logout", function(req, res) {
    req.session.destroy(function() {
        res.redirect("/");
    });
});

module.exports = router;
