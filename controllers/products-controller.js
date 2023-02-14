const provider = require("../providers/baseDataProvider");

exports.GET = function (req, res) {
    let url = provider.url + `/product/${req.params.name}/page/${req.params.page ? req.params.page : 1}`;
    provider.domParser(url).then(items => {
        res.json({
            status: "success",
            message: 'products loaded',
            items: items
        });
    }).catch(err => {
        res.json({
            status: "failed",
            message: err.message,
            items: []
        });
    });
};