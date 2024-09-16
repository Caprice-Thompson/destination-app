const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");

const markup = `
<ul class="fruits">
  <li class="fruits__mango"> Mango </li>
  <li class="fruits__apple"> Apple </li>
</ul>
`;

const $ = cheerio.load(markup);
console.log(pretty($.html()));

// How to Select an Element in Cheerio
const mango = $(".fruits__mango");
console.log(mango.html()); // Mango

//How to Get the Attribute of an Element in Cheerio

const apple = $(".fruits__apple");
console.log(apple.attr("class")); //fruits__apple

// How to Get the Text of an Element in Cheerio
const mangoText = $(".fruits__mango").text();
console.log(mangoText); // Mango

// How to Get the HTML of an Element in Cheerio
const appleHtml = $(".fruits__apple").html();
console.log(appleHtml); // Apple

// How to Loop Through a List of Elements in Cheerio

const listItems = $("li");
console.log(listItems.length); // 2
listItems.each(function (idx, el) {
  console.log($(el).text());
});
// Mango
// Apple

// How to Append or Prepend an Element to a Markup in Cheerio
const ul = $("ul");
ul.append("<li>Banana</li>");
ul.prepend("<li>Pineapple</li>");
console.log(pretty($.html()));

// How to Remove an Element from a Markup in Cheerio