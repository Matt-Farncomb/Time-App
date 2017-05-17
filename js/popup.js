var new_counter = 0;

//This function is responsible for all the JSON requests.
//Upon clicking on the cities in the popup, the JSON requests are called and appended to the DOM.
function cool_function(event) {
    //Makes each city button white
    $(".Option0, .Option1, .Option2").css('background-color', 'white');
    //Makes the option button grey
    $(".options").css('background-color', '#6562621');
    //changes the color of the button that has been clicked on to highlight it to show it has been selected
    $(this).css('background-color', '#db5454');
    //A list used to help with displaying the date
    var testy = [];

    //A JSON requst to retrieve the date and time from timezonebd.com and display it in a readable format
    $.getJSON("http://api.timezonedb.com/v2/get-time-zone?key=V5OPOP9EYHAZ&format=json&fields=zoneName,formatted&by=zone&zone="
     + event.data.param1,
      function(result) {
        $.each(result, function(key, value) {
            $('.date, .time').empty();
            if (key == "formatted") {
                for (i = 0; i < value.length; i++) {
                    if (i < 10) {
                        testy.push(value[i]);
                    } else if (i == 10) {
                        testy = testy.join("");
                        $(".date").append(convertDate(testy));
                    } else if (i > 10) {
                        $('.time').append(value[i]);
                    }
                }
            }
        });
    });

    //A JSON request used to retrieve the temperature from openweathermap.org and convefrt it to derees celcius
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="
     + event.data.param2 + "&appid=039025f0d8d6cb4c35c0882409e0a0c8",
      function(result) {
        $('.temp').empty();
        $.each(result, function(key, value) {
            if (key == "main") {
                $.each(value, function(key, value) {
                    if (key == "temp") {
                        $('.temp').append(key);
                        $('.temp').append(": ");
                        $('.temp').append(parseInt(value - 273.15) + '&#8451;');
                    }
                });
            }
        });
    });


    //A JSON request from openweathermap.org used to display the weather conditions
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="
     + event.data.param2 + "&appid=039025f0d8d6cb4c35c0882409e0a0c8",
      function(result) {
        $('.rain').empty();
        $.each(result, function(key, value) {
            if (key == "weather") {
                $.each(value, function(key, value) {
                    $.each(value, function(key, value) {
                        if (key == "main") {
                            $('.temp').append(" - " + value);
                        }
                    });
                });
            }
        });
    });
}

//Converts the date to a more legible format
function convertDate(date) {
    var d = new Date();
    var n = d.toDateString();
    return n;
}

//Formats the string from the JSON request form tmezonedb to be more readable
function updateTrimmed(color, trimmed) {
    var n = color.lastIndexOf("/");
    trimmed = color.substring(n + 1);
    trimmed = removeUnwantedChar(trimmed);
    return trimmed;
}

//Enables the user to click on each city button in the popup and see all info from the JSON requests
function updatePopUp(color, trimmed, class_name) {
    //essentially checks if the vity buttin displpays an actual city name, if not, leave it invisible.
    if (color == "Choose a City") {
        color == "";
    } else {
        //counter is used to decide wether to display the '+'' or 'add cities' as a link to the options menu
        new_counter++;
        if (new_counter == 3) {
            $(".options").html("+");
        }
        else {
            $(".options").html("Add Cities");
        }
        $(class_name).removeClass('invisible').empty().append(trimmed);
        $(class_name).click({
            param1: color,
            param2: trimmed
        }, cool_function);
    }
}

//format the countries/cities with underscores to be more readable
function removeUnwantedChar(string) {
    var temp_list = [];
    for (i = 0; i < string.length; i++) {

        if (string[i] == "_") {
            temp_list.push(" ");
        } else {
            temp_list.push(string[i]);
        }
    }
    string = temp_list.join("");
    return string;
}

//On page load, make sure all city buttons will contain and siplay the cprrect info in the correct format.
$(document).ready(function() {
    //used to keep track of the the amount of ities displayed. If more than 2, change 'Add Cities' to a '+'
    var new_counter = 0;
    //the standard display for the cities is invisible, until they have cities added to them
    $('.Option0, .Option1, .Option2').addClass('invisible');

    var trimmed0;
    var trimmed1;
    var trimmed2;

    //enable the 'options' button (+ or Add Cities) to link to the options page.
    $(".options").click(function() {
        browser.runtime.openOptionsPage();
    });

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    //when item is retrieved from storage...
    function onGot(item) {
        if (item.color) {
            color = item.color;
            trimmed0 = updateTrimmed(color, trimmed0);
            updatePopUp(color, trimmed0, ".Option0");
        }


        if (item.color1) {
            color1 = item.color1;
            trimmed1 = updateTrimmed(color1, trimmed1);
            updatePopUp(color1, trimmed1, ".Option1");
            
        }


        if (item.color2) {
            color2 = item.color2;
            trimmed2 = updateTrimmed(color2, trimmed2);
            updatePopUp(color2, trimmed2, ".Option2");
            
        }
    }

    var getting = browser.storage.local.get("color");
    var getting1 = browser.storage.local.get("color1");
    var getting2 = browser.storage.local.get("color2");
    getting.then(onGot, onError);
    getting1.then(onGot, onError);
    getting2.then(onGot, onError);
});