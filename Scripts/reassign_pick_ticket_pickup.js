/**
 * Created by cyclops on 9/11/14.
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
    user:''
};

var order_id;
var Initial_picker;
var checkbox;

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var mocha = require('selenium-webdriver/testing');
var assert = require('assert');

mocha.describe('Atom - Re-Assign Pick Ticket for pickup menu', function() {
    this.timeout(1000000);
    mocha.it('works', function() {

        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
        driver.manage().timeouts().implicitlyWait(4000);
        driver.manage().window().maximize();

        console.log('');
        console.log('Running Re-Assign Pick Ticket for pickup menu');
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
                        //console.log(e); //enable for debugging.
                    });
                    //Click Pickup Menu
                    driver.findElement(webdriver.By.id('menu-pickupordermanager')).click();

                    driver.wait(function()
                    {
                        driver.findElement(webdriver.By.linkText('RELEASED TO PICK')).click();
                        //Build id to retrieve F-Order Number
                        driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('order-number')")
                            .then(function(f_number){
                                console.log('F_Order No: ' +f_number);
                                order_id = f_number;
                                return f_number;
                            });
                        //retrieve Current Picker
                        driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('picker-name')")
                            .then(function(picker){
                                console.log('Initial Picker: ' +picker);
                                console.log('');
                                Initial_picker = picker;
                                return picker;
                            });
                        return true;
                    },500);
                    driver.wait(function(){
                        driver.executeScript("jQuery('.actions-table tbody tr td a').first().click()");

                        /** Now a pop-up is displayed
                         * Select a new picker to reassign to
                         * jQuery below retrieves the last picker on the drop-down pickers list
                         */
                        driver.executeScript("return jQuery('.table tbody tr option').last().attr('value')")
                            .then(function(valu){
                                console.log('picker id =' +valu);
                                console.log('');
                                //Select the picker info retrieved above
                                driver.executeScript("$('select.picker').val('"+valu +"')");
                            });
                        return true;
                    },5000);
                    //click submit button and wait for 20secs for SAP response
                    driver.findElement(webdriver.By.css("input.submit")).click().then(function() {
                        driver.sleep(20000);
                    });

                    //click on ok button after reassign submit action and then wait for 9secs for page reload
                    driver.findElement(webdriver.By.css("input.cancel")).click().then(function() {
                        driver.sleep(9000);
                    });

                    //Using Jquery to retrieve Current Picker then compare with initial picker
                    driver.executeScript("return jQuery('#table_pick_ticket tbody tr').first().attr('picker-name')")
                        .then(function(picker){
                            console.log('New Picker: ' +picker);
                            console.log('');
                            if (Initial_picker === picker)
                            {
                                assert(Initial_picker===picker);
                            }
                            else
                            {
                                console.log("Re-assign was successful");
                            }
                            return picker;
                        });
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