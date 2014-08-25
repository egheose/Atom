//Order Status Logic (OSL) Test Script

//TESTS FOR 404 PAGES
var Atom={
    dataFile:'something.csv',
    title:'404 Not Found | Konga Nigeria',
    testOutputFile:'test.csv',

    testResult:{
        totalPages:0,
        total404Pages:0,
        total200Pages:0,
        totalNotTestedPages:0
    },
    increamentNOTTestedPages:function(){
        this.testResult.totalNotTestedPages=this.testResult.totalNotTestedPages+1;
    },
    increament200Pages:function(){
        this.testResult.total200Pages=this.testResult.total200Pages+1;
    },
    increament404Pages:function(){
        this.testResult.total404Pages=this.testResult.total404Pages+1;
    }
}

var readData=[];
var csv = require('csv-streamify');
var fs = require('fs');
var mysql =  require('mysql');
var webdriver = require('selenium-webdriver');
var assert = require('assert');



fs.truncate(Konga.testOutputFile, 0, function(){console.log('dataFile cleared')});
fs.truncate(Konga.dataFile, 0, function(){console.log('LogFile cleared')});
// connect to db and get data
var connection =  mysql.createConnection({
    host : '162.13.103.86',//db_host
    user : '478ese',
    password: 'y7@$789',
    database:'x1960'
});

connection.connect();

//get fresh data from db
var query  =connection.query("SELECT cpf1.url_key FROM catalog_product_flat_1 cpf1 LEFT JOIN mag_ext.master_catalog_product_category mmg ON (mmg.product_id = cpf1.sku) WHERE mmg.cat_name LIKE '%Fashion%'");
query
    .on('error', function(err) {
        console.log("db error ");
        console.log(err);
    })
    .on('result', function(row) {
        console.log(" data found");
        // Pausing the connnection is useful if your processing involves I/O
        connection.pause();
        //do something with the row
        console.log(row);
        console.log(row.url_key);
        logToFile(Konga.dataFile,'http://www.konga.com/'+row.url_key);
        //resume the connection
        connection.resume();

    })
    .on('end', function() {
        // all rows have been received
        console.log("end of db reach");
        connection.end();
        logToFile(Konga.dataFile,'http://www.konga.com/')
    });


function logToFile(file,message){
    console.log("adding "+message+" to file "+file);
    fs.appendFile(file, message+"\n", function (err) {
        if (err){
            throw err;
        }
    });
}