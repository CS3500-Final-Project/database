function makeGetRequest(
    url
  ) {
    let promise = new Promise(
      function(
        resolve,
        reject
      ) {
        var request = new XMLHttpRequest();

        request.open(
          "GET",
          url
        );

        request.onload = function() {
          let status = this.status;

          if (
            status >= 200
            && status < 300
          ) {
            resolve(
              this.response
            );
          }
          else {
            reject(
              this.statusText
            );
          }
        }; // onload callback

        request.send();
      } // executor
    ); // promise

    return promise;
  } // makeGetRequest


  var imagePreviews = [];
  //-----------------------------------------------this is setup to display admin info, need to make it dynamic for all users! --------------------------------
  makeGetRequest('/account-details/admin').then(
    ( response ) => {
      // response might be text (a JSON string)
      // or it could be an object...
      // I was getting JSON strings even with
      // the headers set up to return JSON
      let userdetails = JSON.parse(response);
      console.log( 'received response from server' );
      console.log(response);
      document.getElementById('accountheader').innerHTML = userdetails.displayname;
      //testing
      let tiles = document.getElementById('tiles');
      tiles.innerHTML = '<hr></br>';
      for(var i=0; i<userdetails.images.length; i++){
        let imagePreview = userdetails.images[i];
        let urlParts = imagePreview.url.split( 'upload/' );
       imagePreview.thumbUrl = urlParts.join( 'upload/t_media_lib_thumb/' );
       imagePreviews.push( imagePreview );
      }

    } // response callback
  );
var view = new Vue(
  {
    el: '#app-container',
    data: {
      imagePreviews: imagePreviews
    }
  }
);
