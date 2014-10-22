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

//Array holds url, page title & Logged in user.
var Atom =
{
    url:'http://dev.atom.igbimo.com/user/login',
    pTitle: 'Atom Web',
    user:''
};

var order_id;
var rtp_btn;
var checkbox;

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var mocha = require('selenium-webdriver/testing');
var assert = require('assert');

mocha.describe('Atom - Release to pick for warehouse menu', function() {
    this.timeout(100000);
    mocha.it('works', function() {

        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
        driver.manage().timeouts().implicitlyWait(4000);
        driver.manage().window().maximize();

        console.log('');
        console.log('Running Release to pick for warehouse menu');
        console.log('');

//Getting instance of Date and storing in @param 'tday'
        var tday = new Date();
        tday.toLocaleFormat;

//Opens The Set Url in Atom array above
        driver.get(Atom.url);

//Login with credentials
        driver.findElement(webdriver.By.id("UserLogin_username")).sendKeys("godwin");
        driver.findElement(webdriver.By.id("UserLogin_password")).sendKeys("godwin");
        driver.findElement(webdriver.By.name('yt0')).click();



        driver.wait(function() {
            return driver.getCurrentUrl().then (function(link){

                if (link==='http://dev.atom.igbimo.com/home/index')
                {
                    console.log("Login Was Successful");
                    console.log("Logged In At: " +tday);

                    //Retrieve User Role

                    driver.call(function() {
                        driver.findElement(webdriver.By.id("nav_username")).getText().then(function(role) {
                            Atom.user = role;
                            if(Atom.user != null)
                            {
                                console.log("\nLogged into " +Atom.user);
                            }
                            else
                            {
                                console.log("User role not set");
                            }
                        });
                    },6000).addErrback(function(e) {
                        // |e| could be any error thrown inside the driver.call(function) block)
                        console.log("Role Element Not Found");
                        console.log(e);

                    });
                    //Click Warehouse orders Menu
                    driver.findElement(webdriver.By.id('menu-dcordermanager')).click();

                    //Build id for checkbox
                    driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-id')")
                        .then(function(row){
                            order_id = row;
                            console.log('id =' +order_id);
                            return row;
                        });
                    driver.wait(function(){
                        if(order_id===null)
                        {
                            console.log("No orders to release");
                            return true;
                        }
                        else
                        {
                            //console.log(order_id +"Testing");
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
                                                            });
                                                        return true;
                                                    },15000);

                                                });
                                            }
                                            else
                                            {
                                                console.log('Release to pick was successful');
                                            }
                                            return true;

                                        },10000);

                                    });
                                return true;
                            },20000);
                        }return true;
                    },5000);

                    console.log("Logging Out...");
                    driver.findElement(webdriver.By.id('logout')).click();
                }
                else
                {
                    console.error('Login Unsuccessful');
                    console.error("\nAttempted Login At: " +tday);
                    assert(link==='http://dev.atom.igbimo.com/home/index');
                }return true;
            });
        },60000);
        driver.quit();


    });

});