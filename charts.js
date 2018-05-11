// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {

  const group = "Feed";
  const defaultTickCount = 15;

  // Firebase setup
  const config = {
    apiKey: "AIzaSyAn9cS4J2VMItPAG7DFDqRfgZfknrVjhQ8",
    databaseURL: "https://dydi-82330.firebaseio.com/",
  };
  firebase.initializeApp(config);

  // Firebase Database setup
  const database = firebase.database();

  // Load the Visualization API and the corechart package.
  google.charts.load("current", {"packages": ["corechart"]});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {
    const tasksRef = database.ref("task").orderByChild("group").equalTo(group);
    tasksRef.once("value", function(tasksSnapshot) {
      let comCount = {
        "Mon": 0,
        "Tue": 0,
        "Wed": 0,
        "Thu": 0,
        "Fri": 0,
        "Sat": 0,
        "Sun": 0,
      };
      let incomCount = {
        "Mon": 0,
        "Tue": 0,
        "Wed": 0,
        "Thu": 0,
        "Fri": 0,
        "Sat": 0,
        "Sun": 0,
      };

      tasksSnapshot.forEach(function(taskSnapshot) {
        if(taskSnapshot.hasChild("status")) {
          var status = taskSnapshot.child("status").val();
          for(d in status) {
            if(moment(d).isSameOrAfter(moment().subtract(7, 'days'))) {
              if(status[d])
                comCount[moment(d).format("ddd")] += 1;
              else
                incomCount[moment(d).format("ddd")] += 1;
            }
          }
        }
      });

      // Create the data table.
      let data = new google.visualization.DataTable();

      data.addColumn("string", "Day");
      data.addColumn("number", "Complete");
      data.addColumn("number", "Incomplete");

      let maxCount = 0;
      for(let i = 1; i <= 7; i++) {
        let day = moment().add(i, "days").format("ddd");
        maxCount = Math.max(maxCount, comCount[day] + incomCount[day]);
        data.addRow([day, comCount[day], incomCount[day]]);
      }

      let tickCount = Math.min(maxCount + 1, defaultTickCount);
      let tickMarks = [];
      for(let i = 0; i < tickCount; i++)
        tickMarks[i] = (i == tickCount - 1) ? maxCount : Math.floor(i * maxCount/ (tickCount - 1));

      // Set chart options
      let options = {
        title: group + " (7 days)",
        isStacked: true,
        vAxis: {
          ticks: tickMarks,
        },
      };

      function selectHandler() {
        let selectedItem = chart.getSelection()[0];
        if (selectedItem) {
          let day = data.getValue(selectedItem.row, 0);
          alert("The user selected " + day);
        }
      }

      // Instantiate and draw our chart, passing in some options.
      let chart = new google.visualization.ColumnChart($("#chart_div")[0]);
      google.visualization.events.addListener(chart, "select", selectHandler);
      chart.draw(data, options);
    });
  }
});