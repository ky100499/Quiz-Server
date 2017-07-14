var router = require("express").Router();

router.get('/manage', function(req, res) {
    if (/*req.session.user_idx != 602*/ !req.session.user_idx) {
        res.redirect("/");

    } else {

        res.render("base", {
            "title": "Admin",
            "msg": "",
            "active": "",
            "user_idx": req.session.user_idx,
            "user_name": req.session.user_name,
            "page_include": "./admin/manage"
        });
    }
});

router.get('/winner', function(req, res) {
    if (req.session.user_idx != 602) {
        res.redirect("/");

    } else {

        res.render("base", {
            "title": "Admin",
            "msg": "",
            "active": "",
            "user_idx": req.session.user_idx,
            "user_name": req.session.user_name,
            "page_include": "./admin/winner"
        });
    }
});

module.exports = router;
