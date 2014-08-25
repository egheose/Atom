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
    //log:'log/log.txt',
    user:''
};

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var mocha = require('selenium-webdriver/testing');
var assert = require('assert');

mocha.describe('Atom Tests Suite', function() {
    this.timeout(10000000);
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
driver.findElement(webdriver.By.id("UserLogin_username")).sendKeys("admin");
driver.findElement(webdriver.By.id("UserLogin_password")).sendKeys("atom");
driver.findElement(webdriver.By.name('yt0')).click();



    driver.wait(function() {
        return driver.getCurrentUrl().then (function(link){

            if (link==='http://dev.atom.igbimo.com/home/index')
            {
                console.log("Login Was Successful");
                console.log("Logged In At: " +tday);
                //fs.appendFile(Atom.log, "\nLogged In At: " +tday +"\nLogin was successful\n");
                console.log("Logging Out...");
                driver.findElement(webdriver.By.id('logout')).click();
            }
            else
            {
                console.error('Login Unsuccessful');
                console.error("\nAttempted Login At: " +tday);
                //fs.appendFile(Atom.log,"\nAttempted Login At: " +tday +"\nLogin was Unsuccessful\n");
                assert(link==='http://dev.atom.igbimo.com/home/index');
            }return true;
        });
    },60000);
driver.quit();


    });

});