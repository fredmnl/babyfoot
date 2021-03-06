
function resetPage(){
    $("#nav-home").parent().removeClass("active");
    $("#nav-leaderboard").parent().removeClass("active");
    $("#nav-games").parent().removeClass("active");
    $("#nav-score-input").parent().removeClass("active");
    $("#nav-add-player").parent().removeClass("active");
    $("#home").hide();
    $("#leaderboard").hide();
    $("#games").hide();
    $("#score-input").hide();
    $("#add-player").hide();
};

function homePage(){
    resetPage();
    $("#nav-home").parent().addClass("active");
    $("#home").show();
};

function leaderboardPage(){
    resetPage();
    $("#nav-leaderboard").parent().addClass("active");
    $("#leaderboard").show();
    loadPlayers();
};

function gamesPage(){
    resetPage();
    $("#nav-games").parent().addClass("active");
    $("#games").show();
    loadGames();
};

function scoreInputPage(){
    resetPage();
    $("#nav-score-input").parent().addClass("active");
    $("#score-input").show();
    loadPlayers();
};

function addPlayerPage(){
    resetPage();
    $("#nav-add-player").parent().addClass("active");
    $("#add-player").show();
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

function submitScore(){
    $.ajax({
        url: '/api/insertGame/?' + $("#score-input").serialize(),
        type: 'GET',
        dataType: 'json',
        success: function(json){
            $('.score-input-log').remove();
            if(json['status'] == 'OK'){
                $(".default-player").prop('selected', true);
                $(".default-score-selector").click();
            }
            $("#score-input").append('<span class="score-input-log">' + JSON.stringify(json) + '</span>');
        }
    });
};

function addPlayer(){
    $.ajax({
        url: '/api/addPlayer/?' + $("#add-player").serialize(),
        type: 'GET',
        dataType: 'json',
        success: function(json){
            $("#add-player").append('<span class="add-player-log">' + JSON.stringify(json) + '</span>');
        }
    });
};

$(document).ready(function(){
    $("#nav-home").on("click", homePage);
    $("#nav-leaderboard").on("click", leaderboardPage);
    $("#nav-games").on("click", gamesPage);
    $("#nav-score-input").on("click", scoreInputPage);
    $("#nav-add-player").on("click", addPlayerPage);
});

