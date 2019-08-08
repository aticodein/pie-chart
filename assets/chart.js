queue()
    .defer(d3.csv, "assets/data.csv")
    .await(makeGraphs);
    
function makeGraphs(error, data) {
    var ndx = crossfilter(data);
     var age_dim = ndx.dimension(dc.pluck('Age'));
    
    
    
    function age_select(k, v) {
        
            if (k == "NA") {
                k = "";
            }
            
        }
    age_select();
    
show_survived_balance(ndx);
dc.renderAll();
}

function remove_blanks(group, value_to_remove) {
    // Filter out specified values from passed group
    return {
        all: function() {
            return group.all().filter(function(d) {
                return d.key !== value_to_remove;
            });
        }
    };
}

remove_blanks();

function show_survived_balance(ndx) {
    
    var age_dim = ndx.dimension(dc.pluck('Age'));
    var show_survived_balance = age_dim.group();
    var survivorsPieChartColors = d3.scale.ordinal()
        .range(['green', 'red', 'orange',]);
    function survivors(k, v) {
        if (k <= "16") {
            return "There are " + v + " Yung";
        }
        if (k > "60") {
            return v + " Seniors";
        }
        if (k === "NA") {
                 v = "some";
        }
        else {
            return "Adults";
        }
    }
    
   /*----- function age_to_group() {
        if (survived_dim <= 18 ) {
            print ("Yung");
        }
        else if ( 18 < survived_dim > 60 ) {
            print ("Adult");
        }
        else {
            print ("Seniors");
        }
    } ------*/
    
    /*---- age_to_group(); -------*/


    dc.pieChart('#survived-pie-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(age_dim)
        .group(show_survived_balance)
        .colors(survivorsPieChartColors)
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                
                  if (d.data.key === "NA") {
                   d.data.key = "";
                  }
                   else { return d.value  ;
                   }
            });
        })
        .title(function(d) {
            return survivors(d.key, d.value);
        });
}

