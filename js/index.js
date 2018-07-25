/*jslint browser: true*/
/*brackets-eslint@1.5.0*/
/*global $, jQuery, alert*/
function init_slider_values() {
    "use strict";
    $('.range-slider-age').jRange('setValue', '6,12');
    $('.range-slider-year').jRange('setValue', '2008,2012');
    $('.range-slider-height').jRange('setValue', '1300,2000');
}
$(document).ready(function () {
    "use strict";
    $('.range-slider-age').jRange({
        from: 6,
        to: 15,
        step: 1,
        scale: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        format: '%s',
        width: 300,
        showLabels: true,
        isRange: true
    });
    $('.range-slider-height').jRange({
        from: 1000,
        to: 2500,
        step: 100,
        scale: [1000, 1300, 1500, 1700, 1900, 2200, 2500],
        format: '%s',
        width: 300,
        showLabels: true,
        isRange: true
    });
    $('.range-slider-year').jRange({
        from: 2006,
        to: 2016,
        step: 1,
        scale: [2006, 2007, 2008, 2009, 2010, 2011, 2012,2013,2014,2015,2016],
        format: '%s',
        width: 300,
        showLabels: true,
        isRange: true
    });
    init_slider_values();
});




function get_age() {
    "use strict";
    return $('.range-slider-age').val().split(",");
}

function get_year() {
    "use strict";
    return $('.range-slider-year').val().split(",");
}

function get_height() {
    "use strict";
    return $('.range-slider-height').val().split(",");
}

function get_gender() {
    "use strict";
    var gender = window.getComputedStyle(
        document.querySelector('.slider'),
        ':after'
    ).getPropertyValue('content');
    if (gender === '"Male"') {
        return 1;
    } else {
        return 2;
    }
}
var resetCanvas = function () {
    "use strict";
    $('#myChart').remove(); // this is my <canvas> element
    $('.chart').append('<canvas id="myChart"><canvas>');
    let canvas = document.querySelector('#myChart');
    let ctx = canvas.getContext('2d');
    ctx.canvas.width = $('.chart').width(); // resize to parent width
    ctx.canvas.height = $('.chart').height(); // resize to parent height
    var x = canvas.width / 2;
    var y = canvas.height / 2;
};

function group_data_by_age(data) {
    grouped_by_age = {}
    for (var i = 0, len = data[0].values.length; i < len; i++) {
        if (!(data[0].values[i][0] in grouped_by_age)) {
            grouped_by_age[data[0].values[i][0]] = []
        }
    }
    for (var i = 0, len = data[0].values.length; i < len; i++) {
        grouped_by_age[data[0].values[i][0]].push(data[0].values[i][1])
    }
    sex= get_gender()
    plot_data(grouped_by_age, sex)
}

function is_obese(age, bmi,sex) {
    if(sex==1){
        if (age >= 6 && age <= 8 && bmi >= 20.6)
            return true
        else if (age > 8 && age <= 9 && bmi >= 22)
            return true
        else if (age > 9 && age <= 11 && bmi >= 23.5)
            return true
        else if (age > 11 && bmi > 25.1)
            return true
    }
    else{
        if (age >= 6 && age <= 8 && bmi >= 20.5)
            return true
        else if (age > 8 && age <= 9 && bmi >= 22)
            return true
        else if (age > 9 && age <= 11 && bmi >= 24.5)
            return true
        else if (age > 11 && bmi > 25.2)
            return true
    }
    return false;
}

function plot_data(grouped_data, sex) {
    const x_labels = Object.keys(grouped_data)
    const y_labels = []
    for (idx = 0; idx < x_labels.length; idx++) {
        age_labels = 0
        for (bmi_index = 0; bmi_index < grouped_data[x_labels[idx]].length; bmi_index++) {
            if (is_obese(x_labels[idx], grouped_data[x_labels[idx]][bmi_index],sex))
                age_labels++
        }
        y_labels.push((age_labels / grouped_data[x_labels[idx]].length) * 100)
    }
    resetCanvas()
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x_labels,
            datasets: [{
                label: 'Obesity percent',
                data: y_labels,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function exc() {
    percentage_by_features(get_gender(), get_height()[0], get_height()[1], get_age()[0], get_age()[1], get_year()[0], get_year()[1])
}

function percentage_by_features(sex, height_lower, height_upper, age_lower, age_upper, year_lower, year_upper) {

    if (sex == 1) {

        sql = 'SELECT age_yrs,BMI from patients_new where age_yrs between ' + age_lower + ' and ' + age_upper + ' and height between ' + height_lower + ' and ' + height_upper + ' and year between ' + year_lower + ' and ' + year_upper + ' and sex=' + sex
        console.log(sql)

    } else {
        sql = 'SELECT age_yrs,BMI from patients_new where age_yrs between ' + age_lower + ' and ' + age_upper + ' and height between ' + height_lower + ' and ' + height_upper + ' and year between ' + year_lower + ' and ' + year_upper + ' and sex=' + sex
    }
    console.log(sql)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'db/slofit.db', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec(sql);
        if (contents.lenght != 0)
            group_data_by_age(contents)
    };
    xhr.send();
}