var router = require("express").Router();

router.get('/users', function(req, res) {
    if (req.session.user_idx != 602) {
        res.redirect("/");

    } else {

        res.render("base", {
            "title": "Admin",
            "msg": "",
            "active": "",
            "user_idx": req.session.user_idx,
            "user_name": req.session.user_name,
            "page_include": "./admin/users"
        });
    }
});

router.get('/rank', function(req, res) {
    if (req.session.user_idx != 602) {
        res.redirect("/");

    } else {

        res.render("base", {
            "title": "Admin",
            "msg": "",
            "active": "",
            "user_idx": req.session.user_idx,
            "user_name": req.session.user_name,
            "page_include": "./admin/rank"
        });
    }
});

module.exports = router;
