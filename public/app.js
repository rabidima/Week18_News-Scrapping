// grab the articles as a json
$.getJSON('/articles', function(data) {
  // for each one
  for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    $('#newsBlock').append('<div class="row"><div class="col-lg-6"><h4 class="newsHeader" data-id="' + data[i]._id + '">'+ data[i].title + '</h4></div><div class="col-lg-6"><img src="'+ data[i].image+'"></div></div><hr>')
    // $('#articles').append('<a href="'+ data[i].link+'"><h3 class="newsHeader" data-id="' + data[i]._id + '">'+ data[i].title + '</h3></a>');
    // $('#pictures').append('<img src="'+ data[i].image+'">');

  }
});

$(document).on('click', '#newsScrap', function(){
  $.getJSON('/articles', function(data) {
  // for each one
  $('#newsBlock').empty();
  for (var i = 0; i<10; i++){
    // display the apropos information on the page

    $('#newsBlock').append('<div class="row"><div class="col-lg-6"><h4 class="newsHeader" data-id="' + data[i]._id + '">'+ data[i].title + '</h4></div><div class="col-lg-6"><img src="'+ data[i].image+'"></div></div><hr>')
    // $('#articles').append('<a href="'+ data[i].link+'"><h3 class="newsHeader" data-id="' + data[i]._id + '">'+ data[i].title + '</h3></a>');
    // $('#pictures').append('<img src="'+ data[i].image+'">');

  }
})
});
 

// whenever someone clicks a p tag
$(document).on('click', '.newsHeader', function(){
  // empty the notes from the note section
  $('#notes').empty();

  // save the id from the p tag
  var thisId = $(this).attr('data-id');



  // now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // with that done, add the note information to the page
    .done(function( data ) {
      console.log(data);

      $('#description').html('<iframe src="' + data.link + '" style="width:100%; height: 400px;"></iframe>');


      $('#notes').append('<img src="' + data.image + '">');
      // the title of the article
      $('#notes').append('<p>You can comment the article</p>'); 
      // // an input to enter a new title
      // $('#notes').append('<input id="titleinput" name="title" >'); 
      // a textarea to add a new note body
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea><br>'); 
      // a button to submit a new note, with the id of the article saved to it
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Comment</button>');

      // if there's a note in the article
      if(data.note){
        // place the title of the note in the title input
        $('#titleinput').val(data.note.title);
        // place the body of the note in the body textarea
        $('#bodyinput').val(data.note.body);
      }
    });
});

// when you click the savenote button
$(document).on('click', '#savenote', function(){
  // grab the id associated with the article from the submit button
  var thisId = $(this).attr('data-id');

  // run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(), // value taken from title input
      body: $('#bodyinput').val() // value taken from note textarea
    }
  })
    // with that done
    .done(function( data ) {
      // log the response
      console.log(data);
      // empty the notes section
      $('#notes').empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $('#titleinput').val("");
  $('#bodyinput').val("");
});

// delete all database

         $(document).on('click', '#button__delete', function() {
                  
                console.log("dataId" + dataId);

                if (confirm("are u sure?")) {
                    $.ajax({
                        type: 'DELETE',
                        url: '/delete',
                        success: function(response) {
                            if (response == 'error') {
                                console.log('Err!');
                            }
                            else {
                                alert('Success');
                                location.reload();
                            }
                        }
                    });
                } else {
                    alert('Canceled!');
                }
            });
     

