const fs = require("fs");
const mongoose = require("mongoose");
const Kid = require("./../models/newKidModel");

// Function to create table data for a weekday and age group
function createTableData(weekday, kidsData) {
  const tableRows = [];

  let counter = 1;

  kidsData.forEach((kid) => {
    const color = kid.color;
    const row = [
      { text: counter, bold: true },
      { text: kid.name, italics: true, color: color },
      { text: "", italics: true, color: color },
      { text: "", italics: true, color: color },
      { text: "", italics: true, color: color },
      { text: "", italics: true, color: color },
    ];
    tableRows.push(row);
    counter++;
  });

  return tableRows;
}

// Function to generate the document definition
async function generateDocumentDefinition() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/Testing", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch all documents from the "kids" collection
    const kids = await Kid.find({});

    // Filter kids into age ranges
    const kids0to2 = kids.filter((kid) => kid.age >= 0 && kid.age <= 2);
    const kids2to4 = kids.filter((kid) => kid.age >= 2 && kid.age <= 4);
    const kids4Plus = kids.filter((kid) => kid.age > 4);

    // Document definition
    const dd = {
      pageSize: "A4",
      content: [],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fillColor: "lightblue",
          fontSize: 13,
          color: "black",
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    // Age ranges
    const ageRanges = [
      { name: "0-2", kids: kids0to2, color: "red" },
      { name: "2-4", kids: kids2to4, color: "blue" },
      { name: "4+", kids: kids4Plus, color: "green" },
    ];

    console.log(ageRanges[0]);
    // flatten and assign color

    const flattenedKids = ageRanges.flatMap((ageGroup) =>
      ageGroup.kids.map((kid) => ({
        ...kid._doc,
        color: ageGroup.color,
      }))
    );

    console.log(flattenedKids);

    const sortedKids = flattenedKids.sort((a, b) => {
      // Sort by age
      if (a.age !== b.age) {
        return a.age - b.age;
      }
      // Sort by name within the same age group
      if (a.name && b.name) {
        return a.name.localeCompare(b.name, "en", {
          sensitivity: "base",
        });
      }
      // Handle cases where name is missing for some objects
      return 0;
    });

    console.log("LOOK AT ME", sortedKids);

    // Iterate through weekdays
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const curr = new Date();

    const thisWeekMonday =
      curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? 7 : 1);

    const nextWeekMonday =
      curr.getDate() -
      curr.getDay() +
      (8 - (curr.getDay() === 0 ? 7 : curr.getDay()));

    weekdays.forEach((weekday, index) => {
      let dayOfWeekDate = new Date(
        curr.setDate(nextWeekMonday + index)
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });

      // Create table data for the current weekday and flattened kids
      const tableData = createTableData(weekday.substring(0, 2), sortedKids);

      // Setting up Date

      // Add weekday and table to the document definition
      dd.content.push(
        { text: `${dayOfWeekDate} ${weekday} `, style: "header" },
        {
          style: "tableExample",
          table: {
            widths: ["5%", "39%", "*", "*", "*", "*"],
            body: [
              // Table headers
              [
                { text: "", style: "tableHeader" },
                { text: "Name", style: "tableHeader" },
                { text: "In", style: "tableHeader" },
                { text: "Initial", style: "tableHeader" },
                { text: "Out", style: "tableHeader" },
                { text: "Initial", style: "tableHeader" },
              ],
              // Table rows
              ...tableData,
            ],
          },
        }
      );

      // Add page break after each weekday except the last one
      if (index < weekdays.length - 1) {
        dd.content.push({ text: "", pageBreak: "after" });
      }
    });

    // Disconnect from MongoDB
    // mongoose.disconnect();

    return dd;
  } catch (err) {
    console.error("Error:", err);
  }
}

module.exports = { generateDocumentDefinition };
