module.exports.controller = (app) => {
    app.get('/users',(req,res) => {
        res.render('index', {title: 'Users page from Controller'});
    })
}