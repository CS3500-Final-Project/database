
var username = '';
var usernameErrors = [];

var password1 = '';
var password2 = '';
var passwordErrors = [];


var displayName = '';
var displayNameErrors = [];

var bio = '';
var bioErrors = [];


var formOutputMessage = [];

var isLoadingModalShown = false;
var isFailResultModalShown = false;
var isSuccessResultModalShown = false;


function onCreateAccountButtonPressed(
  event
) {
  event.preventDefault();

  // todo copy in stuff
  //

  // to prevent the form from doing the default form action
  // of navigating/refreshing the page
  return false;
}


var vueRoot = new Vue(
  {
    el: '#app-container',
    data: {
      username: username,
      usernameErrors: usernameErrors,
      password1: password1,
      password2: password2,
      passwordErrors: passwordErrors,

      displayName: displayName,
      displayNameErrors: displayNameErrors,
      bio: bio,
      bioErrors: bioErrors,

      formOutputMessage: formOutputMessage,
      isLoadingModalShown: isLoadingModalShown,
      isFailResultModalShown: isFailResultModalShown,
      isSuccessResultModalShown: isSuccessResultModalShown
    }
  }
);
