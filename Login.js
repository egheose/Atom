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
    pTitle: 'ATOM - Home',
    log:'Log/login.txt',
    user:'',

    menu:
    {
        m1:'',
        m2:'',
        m3:''
    }
};

var fs = require('fs');
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
driver.manage().timeouts().implicitlyWait(4000);
driver.manage().window().maximize();

//Opens The Set Url in Atom array above
driver.get(Atom.url);

//Clears Logfile specified above in Atom Array
fs.truncate(Atom.log, 0);

//Login with credentials
driver.findElement(webdriver.By.id("UserLogin_username")).sendKeys("admin");
driver.findElement(webdriver.By.id("UserLogin_password")).sendKeys("admin");
driver.findElement(webdriver.By.name('yt0')).click();

//Retrieve Page Title
driver.getTitle().then(function(title){
    if(Atom.pTitle===title)
    {
        //Getting instance of Date and storing in @param 'tday'
        var tday = new Date();
        tday.toLocaleFormat;


//Retrieve User Role

        driver.call(function() {
            driver.findElement(webdriver.By.id("nav_username")).getText().then(function(role) {
                Atom.user = role;
                if(Atom.user != null)
                {
                    fs.appendFile(Atom.log,tday +"\nUser: " +Atom.user +"\nLogin was successful\n");
                }else{ fs.appendFile(Atom.log, "User Role Not Set"); }
            });
        }).addErrback(function(e) {
            // |e| could be any error thrown inside the driver.call(function) block)
            fs.appendFile(Atom.log, "\nROLE ELEMENT NOT FOUND\n" /* +e.stack */);
        });

        driver.quit();
    }
    else
    {
        fs.appendFile(Atom.log, "\nLogin Was Unsuccessful\nTitle:\n" +title);
        driver.quit();
    }
});
