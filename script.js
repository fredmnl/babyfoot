
function homePage(){
    $("#nav-home").parent().addClass("active");
    $("#nav-leaderboard").parent().removeClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#score-input").hide();
    $("#leaderboard").hide();
    $("#home").show();
};

function leaderboardPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-leaderboard").parent().addClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#score-input").hide();
    $("#leaderboard").show();
    $("#home").hide();
    loadPlayers();
};

function scoreInputPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-leaderboard").parent().removeClass("active");
    $("#nav-score-input").parent().addClass("active");
    $("#score-input").show();
    $("#leaderboard").hide();
    $("#home").hide();
    loadPlayers();
};

function loadPlayers(){
    $("#leaderboard tbody").empty(); // Remove the leaderboard
    $(".player-option").remove(); // Remove player options from the selectors
    $(".player-selector").prop('disabled', true);
    $(".default-player").prop('selected', true);
    $.ajax({
        url: '/api/getPlayers/',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(let index in json){
                // Add new player options to all four player selectors
                let player = json[index];
                $(".player-selector").append($('<option/>', {
                    class: 'player-option',
                    value: player['name'],
                    text : player['name']
                }));

                // Add an entry to the leaderboard
                $("#leaderboard tbody").append('<tr><th scope="row">' + player['name'] + '</th><td>' + player['rating'] + '</td></tr>');
            }
            $(".player-selector").prop('disabled', false);
        }
    });

};

$(document).ready(function(){
    console.log("ready!");
    $("#nav-home").on("click", homePage);
    $("#nav-leaderboard").on("click", leaderboardPage);
    $("#nav-score-input").on("click", scoreInputPage);
});

