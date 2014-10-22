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
    user:''
};

var row_id;
var escalate_btn;
var checkbox;

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var mocha = require('selenium-webdriver/testing');
var assert = require('assert');

mocha.describe('Atom - Manual Escalation for warehouse menu (Verified)', function()
{
    this.timeout(60000);
    mocha.it('works', function() {

        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
        driver.manage().timeouts().implicitlyWait(4000);
        driver.manage().window().maximize();

        console.log('');
        console.log('Running Manual Escalation for warehouse menu (Verified)');
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
                    driver.findElement(webdriver.By.id("menu-dcordermanager")).click();

                    //Build id for checkbox
                    driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-id')")
                        .then(function(row){
                            row_id = row;
                            console.log('id =' +row_id);
                            return row;
                        });

                    driver.wait(function(){
                        if(row_id===null)
                        {
                            console.log("No orders to escalate");
                            return true;
                        }
                        else
                        {
                            escalate_btn = "escalate_btn_" +row_id;
                            driver.findElement(webdriver.By.id(escalate_btn)).click();
                            driver.executeScript("return jQuery('.table tbody tr option').last().attr('value')")
                                .then(function(valu){
                                    driver.executeScript("$('select.report-reason').val('"+valu +"')");
                                    driver.findElement(webdriver.By.css("input.submit")).click();
                                    driver.sleep(3000);
                                    return true;
                                });
                            driver.wait(function(){
                                //driver.findElement(webdriver.By.id("escalate_comment")).sendKeys("By Automation Script");
                                driver.findElement(webdriver.By.css("input.cancel")).click();
                                return true;
                            },5000);

                            driver.sleep(9000);
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
        },60000);
        driver.quit();


    });

});