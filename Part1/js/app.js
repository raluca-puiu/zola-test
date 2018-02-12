/**
 * Collection of people objects
 * @type {{}}
 */
var people = {};

/**
 * Collection of unique categories
 * @type {Array}
 */
var categories = [];

/**
 * Template for a person box
 * @type {string}
 */
var boxTemplate = [
    '<div class="person__Box {{class}}">',
    '<div class="person__name"><h2>Name: {{name}}</h2></div>',
    '<div class="person__age">Age: {{age}}</div>',
    '<div class="priority">Priority: {{priority}}</div>',
    '<div class="category">Category: {{category}}</div>',
    '</div>'
].join('\n');

$(document).ready(function () {
    initData();
});

/**
 * Get the people and categories from the "server" via AJAX
 */
function initData() {
    var url = 'https://raw.githubusercontent.com/raluca-puiu/zola/master/zola-master/Part1/data.json';

    $.get(url, function (response) {
        people = $.parseJSON(response).data;

        if (people) {
            categories = extractUniqueCategories(people);

            // "Draw" categories <select>
            renderCategoriesSelect();

            // Draw people boxes
            renderPeopleBoxes(people);

        } else {
            console.log('Error: no people found');
        }
    });
}

/**
 * Extract unique categories from the people object
 * @param people
 */
function extractUniqueCategories(people) {
    var allCategories = [];

    $(people).each(function (index, person) {
        allCategories.push(person.category);
    });

    return $.unique(allCategories);
}

/**
 * "Draw" categories <select>
 */
function renderCategoriesSelect() {
    var options = '<option value="0"> Select</option>';

    $(categories).each(function (index, category) {
        options += '<option value="' + category + '">' + category + '</option>';
    });

    var categoriesSelect = [
        '<select id="categoriesSelect" onchange="filterByCategory(this.value)">',
        options,
        '</select>'
    ].join('\n');

    $('#categories').html(categoriesSelect);
}

/**
 * "Draw" people boxes
 */
function renderPeopleBoxes(people) {
    $('#boxes').html('');

    $(people).each(function (index, person) {
        drawBox(person);
    });
}

/**
 * "Draw" a box with a person
 * @param person
 */
function drawBox(person) {
    var box = boxTemplate
        .replace('{{class}}', 'box' + person.priority)
        .replace('{{name}}', person.name)
        .replace('{{age}}', person.age)
        .replace('{{priority}}', person.priority)
        .replace('{{category}}', person.category);

    $('#boxes').append(box);
}

function filterByPriority(selectedPriority) {
    resetOtherFilters(['sort', 'category']);

    if(selectedPriority == 0) {
        // If no specific priority selected, draw boxes for all people
        renderPeopleBoxes(people);
    } else {
        $('#boxes').html('');

        $(people).each(function (index, person) {
            if (person.priority == selectedPriority) {
                drawBox(person);
            }
        });
    }
}

/**
 * Filter people by category
 * @param selectedCategory
 */
function filterByCategory(selectedCategory) {
    resetOtherFilters(['sort', 'priority']);

    if (selectedCategory == 0) {
        // If no specific category selected, draw boxes for all people
        renderPeopleBoxes(people);
    } else {
        $('#boxes').html('');

        $(people).each(function (index, person) {
            if (person.category == selectedCategory) {
                drawBox(person);
            }
        });
    }
}

function sortBy(filter) {
    resetOtherFilters(['category', 'priority']);

    if (filter == 'az') {
        // Draw people alphabetically
        var alpha = cloneArray(people);
        alpha.sort(sortByName);
        renderPeopleBoxes(alpha);
    } else if (filter == 'priority') {
        // Draw people by priority
        var prio = cloneArray(people);
        prio.sort(sortByPriority);
        renderPeopleBoxes(prio);
    } else {
        // Draw people in their original order
        renderPeopleBoxes(people);
    }
}

/**
 * Sort people by name
 * @param a
 * @param b
 * @returns {number}
 */
function sortByName(a, b) {
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

/**
 * Sort people by priority
 * @param a
 * @param b
 * @returns {number}
 */
function sortByPriority(a, b) {
    var aPriority = parseInt(a.priority);
    var bPriority = parseInt(b.priority);
    return ((aPriority < bPriority) ? -1 : ((aPriority > bPriority) ? 1 : 0));
}

/**
 * Reset other filters when one is selected
 * @param filters
 */
function resetOtherFilters(filters) {
    $(filters).each(function (index, name) {
        if(name == 'sort') {
            $('#sortSelect').val('featured');
        } else if(name == 'category') {
            $('#categoriesSelect').val(0);
        } else if(name == 'priority') {
            $('#pf0').prop('checked', 'checked');
        }
    });
}

/**
 * Clone an array of objects
 * @param array
 */
function cloneArray(array) {
    return JSON.parse(JSON.stringify(array));
}