var Post = require('./models/posts')
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        Post.find({},function(err,data){
            if(err) return res.send(err);
            res.render('index.ejs', {
            user : req.user,
            posts:data,
            title:"All the links posted by the users",
            filter :function(user){
   return data.filter(function(id){
       if(id.id_user==user){
           return true
       }
   })
 }
        });
        })

    });
    app.get('/newpost',isLoggedIn,function(req,res){
        res.render('newlink.ejs',{
            user:req.user
        });
    })
    app.post('/newpost',isLoggedIn,function(req,res){
        var widths = ['grid-item--width2','grid-item--width3','grid-item--width4'];
        var random = Math.round(Math.random() * (2 - 0) + 0);
        console.log(random);
      var title = req.body.title;
      var url = req.body.url;
      var newPost = new Post({
          title:title,
          id_user:req.user.username,
          url:url,
          width: widths[random]
      });
      newPost.save({},function(err){
          if(err) throw err;
          res.redirect('/profile');
      });
    })
    app.delete('/post/:id',isLoggedIn,function(req,res){
        var id = req.params.id;
        Post.findById(id, function (err, product) {
            if(err)  res.send(err);
    if(product){
        console.log(product);
        if(product.id_user===req.user.username){
            Post.remove({"_id":id},function(err){
                if(err) res.send(err);
                res.redirect('/');
            });
        }
        else{
            res.send("Unauthorized");
        }
    }
    else{
        res.send("No post found")
    }
  })
        
    })
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        var user = req.user;
        Post.find({id_user:user.username},function(err,data){
            if(err) return res.send(err);
            res.render('index.ejs', {
            user:req.user,
            posts:data,
            title:"My links"
        });
        })
        
    });
    app.get('/profile/:id', isLoggedIn, function(req, res) {
        Post.find({id_user:req.params.id},function(err,data){
            if(err) return res.send(err);
            res.render('index.ejs', {
            user:req.user,
            posts:data,
            title:"Links posted by"+req.params.id
        });
        })
        
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/mybook',isLoggedIn,function(req,res){
        /*load my books */
        res.render('newlink.ejs',{
            user:req.user
        });
    });

    

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter'));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/',
                failureRedirect : '/'
            }));


    

       




};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
