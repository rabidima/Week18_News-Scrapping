// grab the articles as a json
$.getJSON('/articles', function(data) {
  // for each one
  for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    $('#newsBlock').append('<div class="headers col-sm-6"><img class="img-thumbnail small" src="'+ data[i].image+'"><p class="newsHeader" data-id="' + data[i]._id + '">'+ data[i].title + '</p></div>')
  }
  // $('#description').append('<h2 class="fresh">Fresh Article</h2>');
  $('#description').append('<h2>' + data[0].title + '</h2><hr>' + '<img src="' + data[0].image + '"</img><h3>' + data[0].content + '</h3>');
   
   // if there is a comment
  if(data[0].comment){

     $('#comments').append('<h5>Comment:  ' + data[0].comment.body + '</h5><p>' + 'Date:  ' + data[0].comment.time + '</p>'); 
   
     }

  $('#input').append('<hr><p>You can comment this article</p>');
  // a textarea to add a new comment body
  $('#input').append('<textarea style="width:50%" id="bodyinput" name="body"></textarea><br>'); 
  // a button to submit a new comment, with the id of the article saved to it
  $('#input').append('<button class="btn btn-primary" data-id="' + data[0]._id + '" id="savecomment">Save Comment</button>');
     

});
    

// clicks a newsHeader
$(document).on('click', '.newsHeader', function(){
  
  // empty the comments from the comment section
  $('#description').empty();
  $('#comments').empty();
  $('#input').empty();

  // save the id
  var thisId = $(this).attr('data-id');

  //make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // add the comment information to the page
    .done(function( data ) {

     // $('#description').html('<iframe src="' + data.link + '" style="width:100%; height: 400px;"></iframe>');
    
     $('#description').append('<h2>' + data.title + '</h2><hr>' + '<img src="' + data.image + '"</img><h3>' + data.content + '</h3>');
   
      // if there is a comment
       if(data.comment){

           $('#comments').append('<h5>Comment:  ' + data.comment.body + '</h5><p>' + 'Date:  ' + data.comment.time + '</p>'); 
       
         }
    
      $('#input').append('<hr><p>You can comment this article</p>');
      // a textarea to add a new comment body
      $('#input').append('<textarea style="width:50%" id="bodyinput" name="body"></textarea><br>'); 
      // a button to submit a new comment, with the id of the article saved to it
      $('#input').append('<button class="btn btn-primary" data-id="' + data._id + '" id="savecomment">Save Comment</button>');
         
    });
});

//click Save comment button
$(document).on('click', '#savecomment', function(){
  // grab the id associated with the article from the button
  var thisId = $(this).attr('data-id');

  // POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      articleObj: thisId,
      time: Date(),
      body: $('#bodyinput').val() // value taken from comment textarea
    }
  })
   .done(function( data ) {
      // empty the comments section
      $('#input').append('<p>Thank you for a comment</p>');

    });

  // remove the values entered in the text area
  $('#bodyinput').val("");
});


$('#scrapeBtn').click(function(){
  $.getJSON('/scrape', function(data){
    location.reload();
  })
})

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
     

