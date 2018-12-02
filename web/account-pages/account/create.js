
var formData = {
  username : '',
  usernameErrors : [],

  password1 : '',
  password2 : '',
  passwordErrors : [],


  displayName : '',
  displayNameErrors : [],

  bio : '',
  bioErrors : [],

  formOutputMessage : []
};


var isLoadingModalShown = false;
var isFailResultModalShown = false;
var isSuccessResultModalShown = false;

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
        '../../create/'
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
      };
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

function onCreateAccountButtonPressed(
  event
) {
  event.preventDefault();

  let creds= {
    username: formData.username,
    password: formData.password1,
    displayName: formData.displayName,
    bio: formData.bio
  }
  //debuggin purposes ----------------------------------------------------------------------GET RID OF THIS
  console.log(JSON.stringify( creds ) );

  postStuffToServer( creds ).then(
    ( response ) => {
      // response might be text (a JSON string)
      // or it could be an object...
      // I was getting JSON strings even with
      // the headers set up to return JSON
      console.log( 'received response from server' );
      console.log( response );

      //let parsedResponse = JSON.parse( response );
      if( response ){
        alert( "username already exists!" );
      }else{
        alert( "Account Created!" );
      }

    } // response callback
  );
  // to prevent the form from doing the default form action
  // of navigating/refreshing the page
  return false;
}


var vueRoot = new Vue(
  {
    el: '#app-container',
    data: {
      formData: formData,

      isLoadingModalShown: isLoadingModalShown,
      isFailResultModalShown: isFailResultModalShown,
      isSuccessResultModalShown: isSuccessResultModalShown
    }
  }
);
