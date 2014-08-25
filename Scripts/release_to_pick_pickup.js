/**
 * Created by cyclops on 8/24/14.
 */
/*****************************
 * Runs with Firefox Browser on local
 * Selenium standalone-server must be started before running script
 * Runs with firefox headless browser on server
 * Server OS: CentOS 6.5
 * Created By Obodeh Samuel
 */

//Array holds url, page title,Logged in user,Menu & Log output file
var Atom =
{
    url:'http://dev.atom.igbimo.com/user/login',
    pTitle: 'Atom Web',
    //log:'Log/log.txt',
    user:''
};

var order_id;
var rtp_btn;
var checkbox;

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var mocha = require('selenium-webdriver/testing');
var assert = require('assert');

mocha.describe('Atom tests suit', function() {
    this.timeout(1000000);
    mocha.it('works', function() {

        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
        driver.manage().timeouts().implicitlyWait(4000);
        driver.manage().window().maximize();



//Getting instance of Date and storing in @param 'tday'
        var tday = new Date();
        tday.toLocaleFormat;

//Opens The Set Url in Atom array above
        driver.get(Atom.url);

//Clears Logfile specified above in Atom Array
        //fs.truncate(Atom.log, 0);

//Login with credentials
        driver.findElement(webdriver.By.id("UserLogin_username")).sendKeys("Marcellus");
        driver.findElement(webdriver.By.id("UserLogin_password")).sendKeys("marcellus");
        driver.findElement(webdriver.By.name('yt0')).click();



        driver.wait(function() {
            return driver.getCurrentUrl().then (function(link){

                if (link==='http://dev.atom.igbimo.com/home/index')
                {
                    console.log("Login Was Successful");
                    console.log("Logged In At: " +tday);
                    //fs.appendFile(Atom.log, "\nLogged In At: " +tday +"\nLogin was successful\n");

                    //Retrieve User Role

                    driver.call(function() {
                        driver.findElement(webdriver.By.id("nav_username")).getText().then(function(role) {
                            Atom.user = role;
                            if(Atom.user != null)
                            {
                                console.log("\nLogged into " +Atom.user);
                                //fs.appendFile(Atom.log,tday +"\n" +Atom.user +"\nAVAILABLE MENUS:\n");
                            }
                            else
                            {
                                console.log("User role not set");
                                //fs.appendFile(Atom.log, "User Role Not Set");
                            }
                        });
                    },6000).addErrback(function(e) {
                        // |e| could be any error thrown inside the driver.call(function) block)
                        console.log("Role Element Not Found");
                        //fs.appendFile(Atom.log, "\nROLE ELEMENT NOT FOUND\n");
                    });
                    //Click Warehouse orders Menu
                    driver.findElement(webdriver.By.id('menu-pickupordermanager')).click();


                    //Click Verified DC Tab
                    console.log("Clicking Verified DC Tab...");
                    //driver.findElement(webdriver.By.id('nav_verified')).click();

                    //Build id for checkbox
                    driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-id')")
                        .then(function(row){
                            console.log('id =' +row);
                            order_id = row;
                            return row;
                        });
                    driver.wait(function(){

                        //use order_id to build checkbox id
                        checkbox ="chk_"+order_id;
                        rtp_btn ="rel_to_pik_btn_"+order_id;
                        //click away by id
                        driver.findElement(webdriver.By.id(checkbox)).click();
                        driver.findElement(webdriver.By.id(rtp_btn)).click();

                        driver.executeScript("return jQuery('.table tbody tr option').last().attr('value')")
                            .then(function(valu){
                                console.log('picker id =' +valu);
                                driver.executeScript("$('select.picker').val('"+valu +"')");
                                driver.findElement(webdriver.By.css("input.submit")).click();
                                driver.wait(function(){
                                    if(driver.findElement(webdriver.By.css("div.content")))
                                    {

                                        driver.findElement(webdriver.By.css("div.content")).then(function(){
                                            driver.call(function(){
                                                driver.executeScript("return jQuery('.content p').last().html()")
                                                    .then(function(msg){
                                                        //console.log(msg);
                                                        if(msg==="The following orders failed from SAP.")
                                                        {
                                                            console.log('Release to pick Failed!');
                                                            assert(msg===null);
                                                        }
                                                        else if(msg==='Error occured! Please try again.')
                                                        {
                                                            console.log(msg);
                                                            assert(msg===null);
                                                        }
                                                        else if(msg===null)
                                                        {
                                                            console.log('Error element is null!');
                                                            assert(msg===null);
                                                            console.log('Release to pick was successful!');
                                                        }

                                                        //assert(msg===null);
                                                    });
                                                return true;
                                            },15000);

                                        });
                                    }
                                    else
                                    {
                                        console.log('Release to pick was successful');
                                    }

                                    //Click the ok button
                                    driver.findElement(webdriver.By.css("input.cancel")).click();
                                    return true;

                                },10000);

                            });
                        return true;
                    },20000);
                    console.log("Logging Out...");
                    driver.findElement(webdriver.By.id('logout')).click();
                }
                else
                {
                    console.error('Login Unsuccessful');
                    console.error("\nAttempted Login At: " +tday);
                    fs.appendFile(Atom.log,"\nAttempted Login At: " +tday +"\nLogin was Unsuccessful\n");
                    assert(link==='http://dev.atom.igbimo.com/home/index');
                }return true;
            });
        },60000);
        driver.quit();


    });

});