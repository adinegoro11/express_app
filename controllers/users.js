module.exports.controller = (app) => {
    app.get('/users',(req,res) => {
        res.render('users', {
            title: 'Users page from Controller',
            description : 'Ini bagian deskripsi'
        });
    })
}