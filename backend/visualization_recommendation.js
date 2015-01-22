var m = require("munkres-js");
var _ = require("lodash");
var Q = require('q');
var query_patterns = require('./visualization_modules/query_visualization_patterns.js');
var query_visualizations = require('./visualization_modules/query_visualizations.js');


// Cost function: 
// Defines how well dimensions and properties match according to their scales of measurement
function calculateCost(dimension, property) {
    if (property.dummy) {
        if (property.dimension === dimension.optionName) {
            return 10;
        } else {
            return 1000;
        }
    }

    var pType = property.type;
    var scaleWeight = 100;

    // A dimension may be able to handle more than one scale of measurement
    // => Take the minimum weight
    for (var i = 0; i < dimension.scalesOfMeasurement.length; i++) {
        var dType = dimension.scalesOfMeasurement[i];
        if (pType === dType) {
            scaleWeight = Math.min(0, scaleWeight);
        } else if (pType === "Quantitative" && dType === "Ratio" || dType === "Quantitative" && pType === "Ratio") {
            scaleWeight = Math.min(1, scaleWeight);
        } else if (pType === "Quantitative" && dType === "Spatial" || dType === "Quantitative" && pType === "Spatial") {
            scaleWeight = Math.min(1, scaleWeight);
        } else if (pType === "Ratio" && dType === "Spatial") {
            scaleWeight = Math.min(1, scaleWeight);
        } else if (pType === "Quantitative" && dType === "Interval" || dType === "Quantitative" && pType === "Interval") {
            scaleWeight = Math.min(2, scaleWeight);
        } else if (pType === "Categorical" && dType === "Nominal" || dType === "Categorical" && pType === "Nominal") {
            scaleWeight = Math.min(1, scaleWeight);
        } else if (pType === "Categorical" && dType === "Ordinal" || dType === "Categorical" && pType === "Ordinal") {
            scaleWeight = Math.min(2, scaleWeight);
        }
    }

    var optionalWeight;
    if (dimension.optional) {
        // Prefer mapping required dimensions over mapping optional dimensions
        optionalWeight = 2;
    } else {
        optionalWeight = 0;
    }

    // TODO: Allow more than 1 associated property per dimension? (For different vocabularies with equivalent properties)
    var propertyFactor;
    if (!dimension.associatedProperty) {
        // Don't know how well the property matches to the dimension => no change
        propertyFactor = 1.0;
    } else if (dimension.associatedProperty === property.key) {
        // Reward matching properties
        // console.log("Property " + property.label + " matches with dimension " + dimension.optionName);
        propertyFactor = 0.5;
    } else {
        // Penalize non-matching properties
        // console.log("Property " + property.label + " doesn't match with dimension " + dimension.optionName);

        propertyFactor = 2.0;
    }

    // TODO: Make sure we get this from the ontology
    var special = (property.special || property.key === "http://www.w3.org/2003/01/geo/wgs84_pos#lat" || property.key === "http://www.w3.org/2003/01/geo/wgs84_pos#long");

    var specialPropertyPenalty = 0;
    if (special && dimension.associatedProperty !== property.key) {
        console.log("Special property " + property.label + " doesn't match with dimension " + dimension.optionName);
        specialPropertyPenalty = 1000;
    }

    var dimensionRole = getDimensionRole(dimension.dimensionRole);
    var propertyRole = property.role;

//    console.log("roles: dimension: " + dimensionRole + " (" + dimension.dimensionRole + ") property " + propertyRole);
    var roleFactor;
    if (dimensionRole && propertyRole) {
        if (dimensionRole === propertyRole) {
            // Known good role
            // console.log("Property " + property.label + " matches with role of dimension " + dimension.optionName);
            roleFactor = 0.75;
        } else {
            // Known false role -- probably pretty bad
            // console.log("Property " + property.label + " doesn't match with role of dimension " + dimension.optionName);
            roleFactor = 3.0;
        }
    } else {
        roleFactor = 1.0;
    }

    var weight = propertyFactor * roleFactor * (scaleWeight + optionalWeight) + specialPropertyPenalty;

    return weight;
}

function getDimensionRole(dimensionRoleURI) {
    switch (dimensionRoleURI) {
        case 'http://linda-project.eu/linda-visualization#Domain':
            return 'Domain';
        case 'http://linda-project.eu/linda-visualization#Range':
            return 'Range';
        default:
            if (dimensionRoleURI) {
                console.log("Unknown Role URI " + dimensionRoleURI);
            }
            return; // undefined
    }
}

// Calculates a cost matrix from two arrays and a cost function by applying
// the cost function for each combination of elements from the two arrays
function calculateCostMatrix(slots, values, costFunction) {
    var costs = [];
    for (var i = 0; i < slots.length; i++) {
        var row = [];
        for (var j = 0; j < values.length; j++) {
            var cost = costFunction(slots[i], values[j]);
            row.push(cost);
        }
        costs.push(row);
    }
    return costs;
}

// Matches an array of properties to the dimensions described by a map of
// visualization patterns and writes the calculated assignments into the 
// visualization description passed
function addRecommendation(visualizationPattern, properties, visualizationDescription) {
    var dimensions = [];
    var propertiesAndDummies = _.clone(properties);
    for (var dimensionName in visualizationPattern) {
        var dimension = visualizationPattern[dimensionName];
        var descDimension = visualizationDescription.structureOptions[dimensionName];
        if (!descDimension.minCardinality) {
            // console.log("optional: " + dimensionName);
            dimension.optional = true;

            var dummy = {
                label: "No " + dimensionName,
                id: "DUMMY",
                dummy: true,
                dimension: dimensionName
            }
            propertiesAndDummies.push(dummy)
        }
        dimensions.push(dimension);
    }

    var costs = calculateCostMatrix(dimensions, propertiesAndDummies, calculateCost);
    var mk = new m.Munkres();
    var solution = mk.compute(costs);

    // console.log(JSON.stringify(dimensions));
    // console.log(JSON.stringify(properties));
    // console.log(JSON.stringify(costs));
    // console.log(JSON.stringify(solution));

    var result = {
        pattern: visualizationPattern,
        description: visualizationDescription,
        numAssignments: solution.length,
        cost: 0
    };

    visualizationDescription.valid = (solution.length > 0);

    for (var i = 0; i < solution.length; i++) {
        var dimension_index = solution[i][0];
        var property_index = solution[i][1];

        var dimension = dimensions[dimension_index];
        var property = properties[property_index];

        // Check if property is dummy
        if (property) {
            var cost = costs[dimension_index][property_index];

            result.cost += cost;
            if (cost >= 100) {
                //  console.log('Bad match: ' + dimension.optionName + " -> " + property.label);
                visualizationDescription.valid = false;
            }

            if (!visualizationDescription.structureOptions[dimension.optionName].value) {
                visualizationDescription.structureOptions[dimension.optionName].value = [];
            }

            visualizationDescription.structureOptions[dimension.optionName].value.push(property);
        } else {
            console.log("Didn't assign dummy property for optional dimension " + dimension.optionName)
        }
    }

    for (var dimensionName in visualizationPattern) {
        var dimension = visualizationDescription.structureOptions[dimensionName];
        if (dimension.value.length < dimension.minCardinality) {
            // console.log('Missing assignment: ' + dimensionName);
            visualizationDescription.valid = false;
        }
    }

    if (!visualizationDescription.valid) {
        for (var dimensionName in visualizationPattern) {
            var dimension = visualizationDescription.structureOptions[dimensionName];
            dimension.value.splice(0, dimension.value.length);
        }
    }

    return result;
}

function ranking(visualizationPatternMap, properties, visualizationDescriptions) {
    var results = [];
    for (var visualizationName in visualizationPatternMap) {
        var visualizationPattern = visualizationPatternMap[visualizationName];
        var visualizationDescription = visualizationDescriptions[visualizationName];
        if (!visualizationDescription) {
            continue;
        }

        console.log("\n" + visualizationName + ":");
        var result = addRecommendation(visualizationPattern, properties, visualizationDescription);
        results.push(result);
    }

    // comparator function for sort()
    function compare(a, b) {
        // All valid results first
        if (a.description.valid && !b.description.valid) {
            return -1;
        } else if (b.description.valid && !a.description.valid) {
            return 1;
        }

        // Prefer configurations with more assignment
        var comparison = b.numAssignments - a.numAssignments;
        if (comparison !== 0) {
            return comparison;
        }

        // For configurations with same number of assignments, prefer less cost
        return a.cost - b.cost;
    }

    // rank allocations
    results.sort(compare);
    return _.map(results, 'description');
}

function recommend(dataselection, endpoint, ontology_graph) {
    console.log('RECOMMENDATION FOR SELECTION:');
    console.log(JSON.stringify(dataselection));

    var visualizationPatternMap;
    return query_patterns.query(ontology_graph, endpoint).then(function (patterns) {
        visualizationPatternMap = patterns;
        return query_visualizations.query(ontology_graph, endpoint);
    }).then(function (visualizationDescriptions) {
        var recommendations = ranking(visualizationPatternMap, dataselection.propertyInfos, visualizationDescriptions);
        for (var i = 0; i < recommendations.length; i++) {
            recommendations[i].dataselection = dataselection.id;
        }
        return recommendations;
    });
}


exports.recommendForDataselection = recommend;