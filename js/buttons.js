//counts the amount of cities clicked on
var count = 0;
//a counter that keeps track of each newly added button/item to the DOM
var countTwo = 0;
//stores each city that is added dynamically
var city_array = ["Perth", "Sydney", "Melbourne", "Rome", "London", "Paris", "Ho_Chi_Minh", "New_York"];
//stores each city once it has been added dynamically
var checked_added = ["Perth", "Sydney", "Melbourne", "Rome", "London", "Paris", "Ho_Chi_Minh", "New_York"];
//a booleon alue for if a city has already been added to the DOM
var already_added = false;
// stores the country/city as a value and the trimmed value of that as the key
var dict = {};
//a counter tracking total cities added to avoid passing the city cap on the page
var new_count = 1;


function display_alert(class_name, message, color) {
    $(class_name).empty().append(message).css('color', color).show().delay(1500).fadeOut();
}


//On page load, disable the save button so the user cannot submit zero number of cities
$(document).ready(function() {
    $('.myclass').removeClass('myclass_hover').addClass('disabled_class no_clicking');
    $('.myclass[type="submit"]').prop('disabled', true);
});


//This function enbles the user to click on the cities to add to storage
$(function() {
    //When injecting code into the DOM, event handlers are not bound to these new elements...
    //Must use --'$(document).on('click', '.class', function() { --  etc
    // special thanks - gibberish - http://stackoverflow.com/questions/24099940/click-event-is-not-working-for-dynamically-added-button

    //When user clicks on .location...
    $(document).on('click', '.location', function() {
        //disable the clicked on button and change its appearence
        $(this).prop('disabled', true).addClass('button_pressed');

        //if no cities have been clicked on yet...
        if (count == 0) {
            //retrieve the value from the clicked button
            $('#color').val(($(this).attr("value")));
            //change the appearence of clicked on button and disable it
            $('.myclass[type="submit"]').prop('disabled', false);
            $('.myclass').removeClass('disabled_class no_clicking').addClass('myclass_hover');
            //increase the counter by one to show 1/3 cities has been clicked on...
            count++
            //if user has already clicked on one city...           
        } else if (count == 1) {
            //retrieve the value from the clicked button
            $('#color1').val(($(this).attr("value")));
            //increase the counter by one to show 2/3 cities has been clicked on...
            count++;
        } else if (count == 2) {
            //retrieve the value from the clicked button
            $('#color2').val(($(this).attr("value")));
            //disable any more cities to be clicked on because the maximum has been reached
            $('.location').prop('disabled', true);
            //restart the counter to zero
            count = 0;

        }
    });
});

//this is used to reset all click on buttons to the user can select new cities.
$(function() {
    //when reset is clicked...
    $('.res').on('click', function() {
        //the counter is reset to zero...
        count = 0;
        //make sure the user cannot save zero cities to storage by disabling save
        $('.myclass[type="submit"]').prop('disabled', true);
        //reset all clicked on buttons to be freash and ready for clicking and change appearence to reflect that
        $('.myclass').removeClass('myclass_hover').addClass('no_clicking disabled_class');
        $('.location').removeClass('button_pressed').prop('disabled', false);
    });
});

//This disables the save button once it has been clicked
//It also makes ure no more cities can be clicked on until it is reset
$(function() {
    $('.myclass').on('click', function() {
        $(this).removeClass('myclass_hover').addClass('disabled_class');
        /*$(this).addClass('disabled_class');*/
        $('.myclass[type="submit"]').prop('disabled', true);
        $('.myclass').addClass('no_clicking');
        $('.location').prop('disabled', true);
    });
});


//This function enables the user to click on the [-] next to the cities and delete them from the optioms menu
$(function() {
    //'click' used this way makes sure the jquery functionality still works on events elements added dynamically.
    $(document).on('click', '.remove', function() {
        //'got class' grabs the class of the clicked on element so this class can be used to target the other elemtn to be removed that contains this class.
        var got_class = $(this).attr("class");
        //this then trims off the unwanted details from 'got class' so to better target the element to be removed
        var n = got_class.indexOf(" ");
        var trimmed = got_class.substring(n + 1);
        $('.' + trimmed).addClass('gone');
        //rmemove the city from the list by grabbing its value, trimming it and then popping it from the list
        to_be_removed = $(this).val();
        //courtesy of - Tom Wadley - http://stackoverflow.com/questions/5767325/how-to-remove-a-particular-element-from-an-array-in-javascript
        var indexed = city_array.indexOf(to_be_removed);
        var indexed2 = checked_added.indexOf(to_be_removed);
        city_array.splice(indexed, 1);
        checked_added.splice(indexed2, 1);
        //minus one from the cap of possible cities to add.
        new_count--;
        //if user has added less than three cities, then enable the chance to add more
        if (new_count < 3) {
            $('.search').prop('disabled', false).removeClass('disabled_class no_clicking');
            $('.text-box2').removeClass('disabled_class').prop('disabled', false);
        }
    });
});

//Enable user to add cities via the text box
$(function() {
    var toSearch = $(".text-box2").val();
    $('.search').click({
        param1: toSearch
    }, coolest_function);
});

//Allows user to dynamically add cities to the options menu.
function coolest_function(event) {
    //vars used for alerting when a city has already been added or not
    var alerted = false;
    var added = false;
    //Take in input and convert to title case
    var toSearch = $(".text-box2").val();
    //Take in input and convert to title case
    var word_list = [];
    for (i = 0; i < toSearch.length; i++) {
        if (i == 0) {
            word_list.push(toSearch[i].toUpperCase())
        } else if (toSearch[i] == "_" || toSearch[i] == " ") {
            word_list.push(toSearch[i] + toSearch[i + 1].toUpperCase());
            i++;
        } else {
            word_list.push(toSearch[i].toLowerCase());
        }
    }
    toSearch = word_list.join("");

    //counter for keeping track of which items to remove
    countTwo++;

    if (city_array.indexOf(toSearch) > -1) {
        if (alerted == false) {
            //flash up an alert saying that adding the city was a failure
            display_alert(".city_alert", "Already added", 'red')
            //used to make sure this alert does not repeat itself.
            alerted = true;
        }
    } else {
        $body = $("body");
        $body.addClass("loading");
        //A json request to check the timexone db and see if user typed city is present
        $.getJSON("http://api.timezonedb.com/v2/list-time-zone?key=V5OPOP9EYHAZ&format=json", function(result) {
            $.each(result, function(key, value) {

                if (key == "zones") {
                    for (i = 0; i < 424; i++) {
                        $.each(value[i], function(key, value) {
                            if (key == "zoneName") {

                                //the below trims out unwanted chars to better display the results from the request
                                var n = value.lastIndexOf("/");
                                var trimmed = value.substring(n + 1);

                                //if the trimmed result is equal to the user typed string, do the following...
                                if (trimmed == toSearch) {
                                    if (city_array.indexOf(trimmed) == -1) {
                                        //add trimmed result to the city_array to keep track of cities added
                                        city_array.push(trimmed);
                                        //add the current value from the result to the dict with a key of trimmed.
                                        //This value would be the country and city, which is needed to search th api
                                        dict[trimmed] = value;
                                        //flash up an alert saying that adding the city was a success.
                                        display_alert(".city_alert", "Successfully added", 'green');                                       
                                        //used to make sure this alert does not repeat itself.
                                        added = true;

                                    }
                                    //if city_array does not contain trimmed result...
                                    else if (city_array.indexOf(trimmed) > -1) {
                                        if (alerted == false) {
                                            //flash up an alert saying that adding the city was a failure
                                            display_alert(".city_alert", "Already added", 'red');
                                            //used to make sure this alert does not repeat itself.
                                            alerted = true;

                                        }
                                    }

                                }

                            }
                        })
                    }
                }
                //Iterates through city_array and appends the newly added city to the DOM
                //Iterate through vity_array
                for (i = 0; i < city_array.length; i++) {
                    //If current iteration of city_arrayis equal to user inputted city...
                    if (city_array[i] == toSearch) {
                        //and user inputted city has not being added to the checked_added array and therefore not in the DOM...
                        if (checked_added.indexOf(toSearch) == -1) {
                            //append the user inpuuted city to the DOM with all its necessary elements
                            $('.test').append("<div class='location_labels remove_" + (countTwo + 7) + " new'>" + toSearch + "</div>");
                            $('.test').append("<br class='remove_" + (countTwo + 7) + "'><input class='location remove_" + (countTwo + 7) + "'  type='button' value=" + "'" + dict[toSearch] + "'" + " id=" + "'" + "button" + (countTwo + 7) + "'" + "/><button class='remove remove_" + (countTwo + 7) + "' id='test_" + (countTwo + 7) + "' type='button' value='" + toSearch + "'>-</button>");

                            //add an aditonal one to the counter so we dont go over the maximum amount of cities allowed                                                                       
                            new_count++;

                            //if the maximum amount of cities is reached...
                            if (new_count >= 3) {
                                $('.search').prop('disabled', true).addClass('disabled_class no_clicking');
                                $('.text-box2').prop('disabled', true).addClass('disabled_class');
                            }
                            //now that the user inputted city has been appended to the DOM, add it to the checked_added list to reflct that
                            checked_added.push(toSearch);
                        } else {
                            //change status to already_added to avoid adding the same city again
                            already_added = true;
                        }
                    }
                }
            })

            // If the json request ends but no city is found...
        }).done(function(d) {
            // stop the loading animation and...
            $body.removeClass("loading");
            if (added == false && alerted == false) {
                //display the alert telling of the failure.
                display_alert(".city_alert", "City not in Database", 'red');
            }
        });

    }


}