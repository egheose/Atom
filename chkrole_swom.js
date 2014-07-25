//To check available menus

var Atom =
{
    url:'http://local.atom.com/user/login',
    pTitle:'',//'ATOM - Pick Ticket Manager',
    log:'Log/S-menu.txt',
    user:'Sam',

    menu:
    {
        m1:'',
        m2:'',
        m3:''
    }
};

var fs = require('fs');
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
driver.manage().timeouts().implicitlyWait(4000);
driver.manage().window().maximize();

//Opens The Set Url in Atom array above
driver.get(Atom.url);

//Clears Logfile specified above in Atom Array
fs.truncate(Atom.log, 0);

//Login with credentials
driver.findElement(webdriver.By.id("UserLogin_username")).sendKeys("magneto");
driver.findElement(webdriver.By.id("UserLogin_password")).sendKeys("12345678");
driver.findElement(webdriver.By.name('yt0')).click();

//Getting instance of Date and storing in @param 'tday'
var tday = new Date();
tday.toLocaleFormat;


//Retrieve User Role

driver.call(function() {
    driver.findElement(webdriver.By.id("nav_username")).getAttribute("innerText").then(function(role) {
        Atom.user = role;
        if(Atom.user != null)
        {
            fs.appendFile(Atom.log,tday +"\n" +Atom.user +"\nAVAILABLE MENUS:\n");
        }else{ fs.appendFile(Atom.log, "User Role Not Set"); }
    });
}).addErrback(function(e) {
    // |e| could be any error thrown inside the driver.call(function) block)
    fs.appendFile(Atom.log, "\nROLE ELEMENT NOT FOUND\n" /* +e.stack */);
});



//Retrieve DCOM Menu
driver.call(function() {
    driver.findElement(webdriver.By.id("menu-dcordermanager")).getAttribute("innerText").then(function(menu1) {
        Atom.menu.m1 = menu1;
        if(Atom.menu.m1 != null)
        {
            fs.appendFile(Atom.log, Atom.menu.m1);
        }else{ fs.appendFile(Atom.log, " "); }
    });

}).addErrback(function(e) {
    // |e| could be any error thrown inside the driver.call(function) block)
    fs.appendFile(Atom.log, "\nDCOM ELEMENT NOT FOUND\n" /* +e.stack */);
});

//Retrieve PickUp-OM Menu
driver.call(function() {
    driver.findElement(webdriver.By.id("menu-pickupordermanager")).getAttribute("innerText").then(function(menu2) {
        Atom.menu.m2 = menu2;
        if(Atom.menu.m2 != null)
        {
            fs.appendFile(Atom.log, Atom.menu.m2);
        }else{ fs.appendFile(Atom.log, " "); }
    });
}).addErrback(function(e) {
    // |e| could be any error thrown inside the driver.call(function) block)
    fs.appendFile(Atom.log, "\nPickupOM ELEMENT NOT FOUND\n" /* +e.stack*/);
});


//Retrieve SWAT-OM Menu
driver.call(function() {
    driver.findElement(webdriver.By.id("menu-swatordermanager")).getAttribute("innerText").then(function(menu3) {
        Atom.menu.m3 = menu3;
        if(Atom.menu.m3 != null)
        {
            fs.appendFile(Atom.log, Atom.menu.m3);
        }else { fs.appendFile(Atom.log, " "); }
    });
}).addErrback(function(e) {
    fs.appendFile(Atom.log, "\nSWAT-OM ELEMENT NOT FOUND\n" /* +e.stack*/);
});
driver.quit();