
function homePage(){
    $("#nav-home").parent().addClass("active");
    $("#nav-leaderboard").parent().removeClass("active");
    $("#nav-games").parent().removeClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#home").show();
    $("#leaderboard").hide();
    $("#games").hide();
    $("#score-input").hide();
};

function leaderboardPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-leaderboard").parent().addClass("active");
    $("#nav-games").parent().removeClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#score-input").hide();
    $("#leaderboard").show();
    $("#games").hide();
    $("#home").hide();
    loadPlayers();
};

function gamesPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-leaderboard").parent().removeClass("active");
    $("#nav-games").parent().addClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#score-input").hide();
    $("#leaderboard").hide();
    $("#games").show();
    $("#home").hide();
    loadGames();
};

function scoreInputPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-leaderboard").parent().removeClass("active");
    $("#nav-games").parent().removeClass("active");
    $("#nav-score-input").parent().addClass("active");
    $("#home").hide();
    $("#leaderboard").hide();
    $("#games").hide();
    $("#score-input").show();
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

function loadGames(){
    $("#games tbody").empty(); // Remove the leaderboard
    $.ajax({
        url: '/api/getGames/',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(let index in json){
                // Add new player options to all four player selectors
                let game = json[index];
                // Add an entry to the leaderboard
                $("#games tbody").append('<tr><th scope="row">' +
                            index + '</th><td>' +
                            game['blueDefense'] + '</td><td>' + game['blueOffense'] + '</td><td>' +
                            game['blueScore'] + '</td><td>' + game['redScore'] + '</td><td>' +
                            game['redOffense'] + '</td><td>' + game['redDefense'] + '</td></tr>');
            }
        }
    });

};

$(document).ready(function(){
    console.log("ready!");
    $("#nav-home").on("click", homePage);
    $("#nav-leaderboard").on("click", leaderboardPage);
    $("#nav-games").on("click", gamesPage);
    $("#nav-score-input").on("click", scoreInputPage);
});

