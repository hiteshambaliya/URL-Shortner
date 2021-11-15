var express = require('express');
var path = require('path');
var validUrl = require('valid-url');
const nanoid = require('nanoid');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use('/custom.js', express.static(path.join(__dirname, '/public/custom.js')));
app.use('/favicon.ico', express.static(path.join(__dirname, '/public/favicon.ico')));
//app.use(express.static('public'));

//Call db connection
const connection = require('./db_config')
connection.once('open', () => console.log('DB Connected'))
connection.on('error', () => console.log('Error'))

const Link = require('./links')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function(req, res){

    Link.find({}, function(err, links){
        if(err){
            res.render("home");
        } else {
            res.render("home", { links });
        }
    });

});

app.get('/:short_code', function(req, res){
    const short_code = req.params.short_code;

    Link.findOne({'urlCode': short_code }, async function (err, link) {
        if (err){
            return res.status(404).json('URL Not Found');
        } else {
            //add +1 to link counter
            const newCounter = {
                clicks: (link.clicks + 1)
            }
            await Link.updateOne({ _id: link._id }, newCounter);
            return res.redirect(link.longUrl);

        }
    });
});

/**
 * api to create new short url and save it.
 */
app.post('/create', async function(req, res){
    const baseURL = "http://localhost:3000/";
    //console.log("req.body=>", req.body);
    const { longUrl } = req.body;


    let short_code = nanoid.nanoid(11);

    if (! validUrl.isUri(longUrl)){
        return res.status(401).json({ error: 'Invalid url.'});
    } else {
        let link = await Link.findOne({'longUrl': longUrl }).exec();
        //console.log("long url searched=>", link);
        if(link){
            return res.status(401).json({ error: 'This url already exist.'});
        }
    }

    //find in database that short_code is already exist in database
    let link = await Link.findOne({'urlCode': short_code }).exec();

    while (link){ //to check untill it don't find id in database for unique short code
        //code already exist so generate new and check again
        short_code = nanoid.nanoid(11);
        link = await Link.findOne({'urlCode': short_code }).exec();
    }

    const shortUrl = baseURL + short_code;

    let ret_data = {
        urlCode: short_code,
        longUrl: longUrl,
        shortUrl: shortUrl,
        clicks: 0,
        date: new Date()
    }
    link = new Link(ret_data);
    await link.save();
    res.send(ret_data);
});

app.listen(3000);