
function homePage(){
    $("#nav-home").parent().addClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#score-input").hide();
    $("#home").show();
};

function scoreInputPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-score-input").parent().addClass("active");
    $("#score-input").show();
    $("#home").hide();
    loadPlayers();
};

function loadPlayers(){
    $.ajax({
        url: '/api/getPlayers/',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(let index in json){
                $("#Player1").append($('<option/>', { 
                    value: json[index],
                    text : json[index]
                }));
                $("#Player2").append($('<option/>', { 
                    value: json[index],
                    text : json[index]
                }));
                $("#Player3").append($('<option/>', { 
                    value: json[index],
                    text : json[index]
                }));
                $("#Player4").append($('<option/>', { 
                    value: json[index],
                    text : json[index]
                }));
            }
        }
    });

};

$(document).ready(function(){
    console.log("ready!");
    $("#nav-home").on("click", homePage);
    $("#nav-score-input").on("click", scoreInputPage);
});

