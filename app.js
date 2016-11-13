"use strict";

var program = require('commander');
var _ = require('lodash');

program
    .version('1.0.0')
    .arguments('<file> <operation> [param1] [param2]')
    .action(function (fileName, operation, param1, param2) {
        // console.log(fileName)
        // console.log(operation)
        processRequest(fileName, operation, param1, param2);
    });

program.parse(process.argv);

function processRequest(fileName, operation, param1, param2) {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (obj == null || obj == undefined) {
        console.log("Invalid file format");
        return;
    }

    switch (operation) {
        case "1":
            console.log(JSON.stringify(obj, null, 2));
            break;
        case "2":
            var arrayLength = obj.length;//we need this to do only one property lookup
            var maxLength = arrayLength > 10 ? 10 : arrayLength;
            for (var i = 0; i < maxLength; i++) {
                console.log(JSON.stringify(obj[i], null, 2));
            }
            break;
        case "3":
            if (obj == null || typeof obj == "undefined") {
                console.log(0);
            } else {
                console.log(obj.length);
            }
            break;
        case "4":
            var filteredArray = obj.filter(x => parseInt(x.id) > parseInt(param1)).sort(x => parseInt(x.id));
            console.log(JSON.stringify(filteredArray, null, 2));
            break;
        case "5":
            var filteredArray = obj.filter(x => parseInt(x.id) > parseInt(param1) && parseInt(x.id) < parseInt(param2)).sort(x => parseInt(x.id));
            console.log(JSON.stringify(filteredArray.length, null, 2));
            break;
        case "6":
            let elements = _(obj)
                .chain()
                .groupBy(x => x.name)
                .map(x => ({ name: x[0].name, count: x.length }))
                .filter(x => x.count > 100)
                .sortBy(x => -1 * x.count)
                .value();

            console.log(JSON.stringify(elements, null, 2));
            break;
        case "7":
            var searchId = parseInt(param1); 
            var item = _(obj)
                .find(x => x.id == searchId);
            //to powinno wystarczyc jesli tylko mamy wyswietlic, nie ma potrzeby zapisywania danych
            var count = 0;
            var parent = item;
            while(parent.parent_id) {
                count++;
                parent = _(obj).find(x => x.id == parent.parent_id);
            }
            console.log(item.name + " - " + count);
            break;
        case "8":
            var filteredItems = _(obj).filter(x => x.name.startsWith('p') && 
                x.name.endsWith('r') && 
                x.name.includes('i') && 
                !x.name.includes('z') &&
                !x.name.includes('j'))
                .value();
            var randomItemIndex = Math.floor(Math.random() * (filteredItems.length + 1)) - 1;
            if(filteredItems && filteredItems.length > 0){
                console.log(filteredItems[randomItemIndex]);
            }
            break;
        case "9":
            var numberOfItems = parseInt(param1);
            if(numberOfItems > obj.length){
                console.log("Za malo elementow w pliku");
                return;
            }
            while(numberOfItems > 0) {
                numberOfItems--;
                var randomItemIndex = Math.floor(Math.random() * (obj.length + 1)) - 1;
                var item = obj.splice(randomItemIndex, 1);
                console.log(JSON.stringify(item[0], null, 2));
            }
            break;
        case "10":
            var averageAge = _(obj).meanBy(x => x.age);
            console.log(averageAge);
            break;
        case "11":
            var idsString = "";
            let ids = _(obj)
                .chain()
                .groupBy(x => x.id)
                .map(x => ({ id: x[0].id }))
                .sortBy(x => -1 * x.id)
                .each(x => idsString += x.id + ", ")
                .value();

            console.log(JSON.stringify(idsString.slice(0, -2), null, 2));
            break;

    }
}
