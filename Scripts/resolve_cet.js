/**
 * Created by cyclops on 9/24/14.
 */
/*****************************
 * Runs with Firefox Browser on local
 * Selenium standalone-server must be started before running script
 * Runs with firefox headless browser on server
 * Server OS: CentOS 6.5
 * Created By Obodeh Samuel
 */

//Array holds url, page title,Logged in user
var Atom =
{
    url:'http://dev.atom.igbimo.com/user/login',
    pTitle: 'Atom Web',
    user:''
};

var row_id;
var f_order;
var resolve_btn;
var F_order;


var webdriver = require('selenium-webdriver');
var mocha = require('selenium-webdriver/testing');
var assert = require('assert');

mocha.describe('Atom - Resolve Cet', function()
{
    this.timeout(60000);
    mocha.it('works', function() {

        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
        driver.manage().timeouts().implicitlyWait(4000);
        driver.manage().window().maximize();

        console.log('');
        console.log('Running resolve_cet');
        console.log('');

//Getting instance of Date and storing in @param 'tday'
        var tday = new Date();
        tday.toLocaleFormat;

//Opens The Set Url in Atom array above
        driver.get(Atom.url);

//Login with credentials
        driver.findElement(webdriver.By.id("UserLogin_username")).sendKeys("admin");
        driver.findElement(webdriver.By.id("UserLogin_password")).sendKeys("atom");
        driver.findElement(webdriver.By.name('yt0')).click();



        driver.wait(function() {
            return driver.getCurrentUrl().then (function(link){

                if (link==='http://dev.atom.igbimo.com/home/index')
                {
                    console.log("Login Was Successful\n");
                    //Click Warehouse Menu
                    driver.findElement(webdriver.By.id("menu-cet")).click();

                    //Build id for checkbox
                    driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-id')")
                        .then(function(row){
                            row_id = row;
                            console.log('id =' +row_id);
                            return row;
                        });

                    //Retrieve Forder to be resolved
                    driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-number')")
                        .then(function(forder){
                            F_order = forder;
                            console.log('Current F-Order =' +F_order);
                            return forder;
                        });

                    driver.wait(function(){
                        if(row_id===null)
                        {
                            console.log("No orders to Resolve");
                            return true;
                        }
                        else
                        {
                            resolve_btn = "btn_resolve_" +row_id;
                            driver.findElement(webdriver.By.id(resolve_btn)).click();
                            //driver.findElement(webdriver.By.css('a.escalate-icon.escalate_order')).click();
                            driver.executeScript("return jQuery('.table tbody tr option').last().attr('value')")
                                .then(function(valu){
                                    driver.executeScript("$('select.report-to').val(1)");
                                    //driver.executeScript("$('select.report-reason').val('"+valu +"')");
                                    driver.findElement(webdriver.By.css("input.submit")).click();
                                    driver.sleep(9000);
                                    return true;
                                });
                            driver.wait(function(){
                                driver.findElement(webdriver.By.css("input.cancel")).click();
                                return true;
                            },5000);

                            //Wait for 10secs after clicking ok button so page reloads successfully
                            driver.sleep(10000);

                            //Retrieve First row's F-order number
                            driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-number')")
                                .then(function(forder){
                                    f_order = forder;
                                    console.log('New F-order =' +forder);
                                    return forder;
                                });

                            if (F_order === f_order)
                            {
                                console.log('Resolve failed!');
                                assert(F_order===f_order).isFalse();
                            }
                            else
                            {
                                console.log('Resolving order was successful.');
                            }
                        }
                        return true;
                    },5000);

                }
                else
                {
                    console.error('Login Unsuccessful');
                    console.error("\nAttempted Login At: " +tday);
                    assert(link==='http://dev.atom.igbimo.com/home/index');
                }return true;
            });
        },50000);
        driver.quit();


    });

});