if (typeof $ !== "function") { 
    alert("This widget requires jquery.");
}

$(document).ready(function() {
    // executes when HTML-Document is loaded and DOM is ready

    console.log("document is ready");

});

var address = "";
var amount = 0;
var balance = 0;
var percentage = 0;

function createBCHwidgetObj() {
    // body...
    address = $(".cashThermometer").attr("address");
    amount = $(".cashThermometer").attr("amount");

    $(".cashThermometer").append(
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://thermometer.cash/thermometer.css\">" +
        "<span class=\"donation-request\">Help us raise " + amount + " BCH</span>" +
        "<div class=\"thermometer\">" +
        "<div id=\"stem\"></div>" +
        "<div id=\"marks\">" +
        "<div id=\"line\">--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--<br>--</div>" +
        "</div>" +
        "<div id=\"merc-stem\">" +
        "<div id=\"mercury\"></div>" +
        "</div>" +
        "<div id=\"bulb\"></div>" +
        "</div>" +
        //"<div class=\"button\">" +
        //"<script src=\"https://paybutton.cash/pre-release/v0.1/js/paybutton.min.js\"></script>"+
        "<button class=\"pay-button\" button-text=\"Donate BCH\" address=" + address + " success-callback=\"updateBalance(address)\"></button>"
        /*+
               "</div>"*/
    );





}

createBCHwidgetObj();

updateBalance(address);

$("#update").on("click", function() {
    // body...
    getInput();
});
// $("#qrcode").on("click",function(){
// 	window.open(address,self);
// });




//$('#qrcode').empty();

// Generate and Output QR Code
//$('#qrcode').qrcode({ width: 200, height: 200, text: address });


// new QRCode(document.getElementById("qrcode"), 'http://thermometer.cash');

// var qrcode = new QRCode("address", {
//                 text: "http://thermometer.cash",
//                 width: 200,
//                 height: 200,
//                 colorDark: "#000000",
//                 colorLight: "#ffffff",
//                 correctLevel: QRCode.CorrectLevel.H
//             });

function getInput() {
    amount = parseFloat($("#amount").val());
    var addr = $("#address").val();
    if (addr.search('#') != -1) {
        getCashAccount(addr);
    } else {
        address = addr;

        updateBalance(address);

    }

    //updateTextArea();

}



async function getCashAccount(string) {
    // body...
    var fields = string.split('#');

    var name = fields[0];
    var number = parseFloat(fields[1]);

    //     const request = async () => {
    //     const response = await fetch('http://api.cashaccount.info/account/' + number + '/' + name+'',{mode: 'no-cors'});
    //     //const json = await response.json();
    //     //console.log(json);
    //     address=response.data.information.payment[0].address;

    // }

    // request().then(()=> {
    // 	console.log(address);
    // });


    /*fetch('http://api.cashaccount.info/account/' + number + '/' + name+'', {mode: 'no-cors'})
    .then(response => response.json())
    .then(data => {
        // Do what you want with your data
        console.log(data);
    })
    .catch(err => {
        console.error('An error ocurred', err);
    });*/
    // */

    $.get('https://api.cashaccount.info/account/' + number + '/' + name + '', { mode: 'no-cors' }, async function(data) {
        console.log(data.information.payment[0].address);
        address = await data.information.payment[0].address;

        updateBalance(await address);

        //return address;
        //result = data.information.payment[0].address;

        //         //return toString(data.information.payment[0].address);
    }, );
    //console.log(result);
    //var address = result.data.information.payment.address;

    //return result;
}

function updateThermometer(percentageValue) {
    // body...
    if (percentageValue > 100) { percentageValue = 100; }
    if (percentageValue < 0) { percentageValue = 0; }

    var adjustment = (percentageValue * 2.3) + 10;
    $("#mercury").css("height", adjustment + "%");
}

function updateButton(address) {
    // body...
    $(".pay-button").attr('address', address);
    //$(".badger-button").attr('data-to',address)
    // qrcode.clear();
    // qrcode.makeCode(address);

    // $('#qrcode').empty();

    // Generate and Output QR Code
    // $('#qrcode').qrcode({ width: 200, height: 200, text: address });

}

async function updateBalance(address) {
    // body...
    // const res = fetch('http://rest.bitcoin.com/v2/address/details/' + address + '');
    // console.log(res.data.balance);

    // balance = await data.data.balance;
    // console.log(balance);
    $.get('https://rest.bitcoin.com/v2/address/details/' + address + '', async function(data) {

        balance = await data.balance;
        console.log(balance);
        updatePage(await balance);
    });
}

function updatePage(balance) {
    // body...
    percentage = (balance / amount) * 100;
    updateThermometer(percentage);
    updateButton(address);
    updateTextArea();
}

function updateTextArea() {
    // body...
    let str = '<div class=\"cashThermometer\" amount=' + amount + ' address=\"' + address + '\"></div><script type=\"text/javascript\" src=\"https://thermometer.cash/index.js\"></script>' +
        '<script src=\"https://paybutton.cash/pre-release/v0.1/js/paybutton.min.js\"></script>';
    $("textarea").text(str);
    $(".donation-request").empty();
    if (percentage < 100) {
        $(".donation-request").append("Help us raise " + amount + " BCH");
    } else { $(".donation-request").append("Goal of " + amount + " BCH raised!"); }

}