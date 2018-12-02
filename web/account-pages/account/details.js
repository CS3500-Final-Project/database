//grab user info and images from server
function postStuffToServer(
  payload
) {
  let promise = new Promise(
    function(
      resolve,
      reject
    ) {
      var request = new XMLHttpRequest();

      request.open(
        "POST",
        './account-details/'
      );

      request.setRequestHeader(
        'Content-Type',
        'application/json'
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

      // not sure if stringification needed.
      // try other method first and switch
      // to this one if there are issues
      // sending an object

      let requestBody = JSON.stringify(
        payload
      );

      request.send(
        requestBody
      );

    } // executor
  ); // promise

  return promise;
} // postStuffToServer

postStuffToServer(
  payload
)
.then(
  ( response ) => {
    // response might be text (a JSON string)
    // or it could be an object...
    // I was getting JSON strings even with
    // the headers set up to return JSON
    console.log( 'received response from server' );
    console.log( response );

  } // response callback
);
