
const ACCEPTABLE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_- ';
function removeUnacceptableCharacters(
  string
) {
  let numberOfCharacters = string.length;
  let cleanedString = '';

  for (
    let characterIndex = 0;
    characterIndex < numberOfCharacters;
    characterIndex++
  ) {
    let character = string.charAt( characterIndex );

    if (
      ACCEPTABLE_CHARACTERS.indexOf(
        character
      ) !== -1
    ) {
      cleanedString.concat( character );
    }
  } // loop through characters

  return cleanedString;
} // removeUnacceptableCharacters



const CREDENTIALS_VALIDATION_RESULT_TYPES = {
  VALID: 'VALID',
  INVALID: 'INVALID'
};
function validateCredentials(
  credentials
) {
  let username = credentials.username;
  let password = credentials.password;

  let validationResults = {
    validity: CREDENTIALS_VALIDATION_RESULT_TYPES.VALID,
    usernameErrors: [],
    passwordErrors: []
  };

  // todo: arrays of constraints
  // for username and password
  if ( username.length < 8 ) {
    validationResults.validity = CREDENTIALS_VALIDATION_RESULT_TYPES.INVALID;
    validationResults.usernameErrors.push(
      'username is too short: must be at least 8 characters'
    );
  }

  if ( password.length < 8 ) {
    validationResults.validity = CREDENTIALS_VALIDATION_RESULT_TYPES.INVALID;
    validationResults.passwordErrors.push(
      'password is too short: must be at least 8 characters'
    );
  }


  return validationResults;
  /*/
  let promise = Promise.resolve(
    validationResults
  );

  return promise;
  //*/
} // validateCredentials


// todo copy in post and get functions
function postStuffToServer(
  payload,
  relativeUrl
) {
  let promise = new Promise(
    function(
      resolve,
      reject
    ) {
      var request = new XMLHttpRequest();

      request.open(
        "POST",
        relativeUrl
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
