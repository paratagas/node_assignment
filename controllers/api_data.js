var fs = require('fs');
var appSettings = require('../settings');
var filePath = appSettings.dataFilePath;

/**
 * Get dat from file
 * 
 * @param {string} filePath Full filename
 */
fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) throw err;
    var dataFromFile = JSON.parse(data);
    fillDataGrid(dataFromFile);
});

var preparedReviewsDataForGrid = [];
var preparedTravellerTypesDataForGrid = [];
var traveledWithSet = {};

/**
 * Prepare data fro grid
 *
 * @param {obj} dataForGrid Parsed json data from file
 */
function fillDataGrid(dataForGrid) {
    if (dataForGrid.length) {
        dataForGrid.forEach(function(item, i, arr) {
            var gridRow = {};

            gridRow.title = item.titles.nl || "";
            gridRow.traveledWith = item.traveledWith || "";
            gridRow.travelDate = formatDateFromIso(item.travelDate);
            gridRow.reviewDate = formatDateFromIso(item.entryDate);
            gridRow.userName = item.user || "";
            gridRow.reviewText = item.texts.nl || "";
            gridRow.averageGeneralRating = calculateRating(item.ratings.general);
            gridRow.averageAspectsRating = calculateRating(item.ratings.aspects);
            gridRow.reviewWeightValue = calculateReviewWeight(item.entryDate);

            if (!traveledWithSet[gridRow.traveledWith]) {
                traveledWithSet[gridRow.traveledWith] = {};
                traveledWithSet[gridRow.traveledWith].name = gridRow.traveledWith;
                traveledWithSet[gridRow.traveledWith].averageGeneralRating = 0;
                traveledWithSet[gridRow.traveledWith].averageAspectsRating = 0;

                traveledWithSet[gridRow.traveledWith].sumOfAverageGeneralRatings = 0;
                traveledWithSet[gridRow.traveledWith].sumOfAverageGeneralRatings += +gridRow.averageGeneralRating;
                traveledWithSet[gridRow.traveledWith].amountOfAverageGeneralRatings = 0;
                traveledWithSet[gridRow.traveledWith].amountOfAverageGeneralRatings++;

                traveledWithSet[gridRow.traveledWith].sumOfAverageAspectsRatings = 0;
                traveledWithSet[gridRow.traveledWith].sumOfAverageAspectsRatings += +gridRow.averageAspectsRating;
                traveledWithSet[gridRow.traveledWith].amountOfAverageAspectsRatings = 0;
                traveledWithSet[gridRow.traveledWith].amountOfAverageAspectsRatings++;
            } else {
                traveledWithSet[gridRow.traveledWith].sumOfAverageGeneralRatings += +gridRow.averageGeneralRating;
                traveledWithSet[gridRow.traveledWith].amountOfAverageGeneralRatings++;

                traveledWithSet[gridRow.traveledWith].sumOfAverageAspectsRatings += +gridRow.averageAspectsRating;
                traveledWithSet[gridRow.traveledWith].amountOfAverageAspectsRatings++;
            }
            //console.log("traveledWithSet: ", traveledWithSet);

            preparedReviewsDataForGrid.push(gridRow);
        });
        //traveledWithSet[gridRow.traveledWith].averageGeneralRating = traveledWithSet[gridRow.traveledWith].sumOfAverageGeneralRatings / traveledWithSet[item.traveledWith].amountOfAverageGeneralRatings;
        //traveledWithSet[gridRow.traveledWith].averageGeneralRating = (traveledWithSet[gridRow.traveledWith].averageGeneralRating).toFixed(1);
//
        //traveledWithSet[gridRow.traveledWith].averageAspectsRating = traveledWithSet[gridRow.traveledWith].sumOfAverageAspectsRatings / traveledWithSet[item.traveledWith].amountOfAverageAspectsRatings;
        //traveledWithSet[gridRow.traveledWith].averageAspectsRating = (traveledWithSet[gridRow.traveledWith].averageAspectsRating).toFixed(1);

        calculateRatingForTravellerTypes(traveledWithSet);
    }
}

/**
 * Format date from ISO format
 *
 * @param {obj} dateInISO Date
 * @returns {string} Date string in format "yyyy-mm-dd"
 */
function formatDateFromIso(dateInISO) {
    var date = new Date(dateInISO);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }

    if (month < 10) {
        month = '0' + month;
    }

    var result = year + '-' + month + '-' + dt;

    return result;
}

/**
 * Calculate review weight
 *
 * @param {int} reviewDateInMs Date in MS
 * @returns {int} Review weight
 */
function calculateReviewWeight(reviewDateInMs) {
    var reviewWeight = 0;
    var reviewDateYear = new Date(reviewDateInMs).getFullYear();
    var reviewDateFormatted = formatDateFromIso(reviewDateInMs);

    var fiveYearsAgoDate = new Date();
    fiveYearsAgoDate.setFullYear(fiveYearsAgoDate.getFullYear() - 5);
    fiveYearsAgoDate = formatDateFromIso(fiveYearsAgoDate);

    var currentDateYear = new Date().getFullYear();
    var currentDateFormatted = formatDateFromIso(new Date());

    if (reviewDateFormatted > fiveYearsAgoDate) {
        reviewWeight = 0.5;
    } else {
        reviewWeight = Math.abs((1 - (currentDateYear - reviewDateYear) * 0.1)).toFixed(1);
    }

    return reviewWeight;
}

/**
* Calculate general and aspect rating
*
* @param {obj} rating Rating
* @returns {int} Average rating
*/
function calculateRating(rating) {
    var averageRating = 0;
    var sum = 0;
    var counter = 0;

    for (var item in rating) {
        sum += rating[item];
        counter++;
    }

    averageRating = (sum / counter).toFixed(1);

    return averageRating;
}

/**
 * Calculate average rating for traveller types
 *
 * @param {obj} traveledWithSet Set of travel types with average ratings
 */
function calculateRatingForTravellerTypes(traveledWithSet) {
    for (var item in traveledWithSet) {
        var gridRow = {};
        gridRow.travellerType = traveledWithSet[item].name;

        traveledWithSet[item].averageGeneralRating = traveledWithSet[item].sumOfAverageGeneralRatings / traveledWithSet[item].amountOfAverageGeneralRatings;
        traveledWithSet[item].averageGeneralRating = (traveledWithSet[item].averageGeneralRating).toFixed(1);
        gridRow.travellerTypeAverageGeneralRating = traveledWithSet[item].averageGeneralRating;

        traveledWithSet[item].averageAspectsRating = traveledWithSet[item].sumOfAverageAspectsRatings / traveledWithSet[item].amountOfAverageAspectsRatings;
        traveledWithSet[item].averageAspectsRating = (traveledWithSet[item].averageAspectsRating).toFixed(1);
        gridRow.travellerTypeAverageAspectsRating = traveledWithSet[item].averageAspectsRating;

        preparedTravellerTypesDataForGrid.push(gridRow);
    }
}

exports.getReviewsData = function(req, res){
    res.status(200);
    res.json(preparedReviewsDataForGrid);
};

exports.getTravellerTypesData = function(req, res){
    res.status(200);
    res.json(preparedTravellerTypesDataForGrid);
};
