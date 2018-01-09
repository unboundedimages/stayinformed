$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>")
    }
});

$(document).on("click", "p", function() {
    $("#notes").empty(); //empty notes
    var thisId = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .done(function(data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>"); // The title of the article
            $("#notes").append("<input id='titleinput' name='title' >"); // An inputew title
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>"); //textarea
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});
