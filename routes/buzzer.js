var router = require("express").Router();

router.get(/.*/, function(req, res) {
    if (!req.session.user_idx) {
        res.redirect("/auth/login");
    } else {
        res.render("base", {
            "title": "Buzzer",
            "msg": "",
            "active": "buzzer",
            "user_idx": req.session.user_idx,
            "user_name": req.session.user_name,
            "page_include": "./buzzer/index"
        });
    }
});

module.exports = router;
