
var account = {
  uid: 0,
  username: '',
  displayName: ''
};

var viewedImageData = {
  imageId: 0,
  uploaderUsername: '',
  imageDescription: '',
  upvotes: 0,
  downvotes: 0,
  comments: []
};
/*
var comment = {
  uid: 0,
  displayName: '',
  message: ''
}
//*/


function upvoteImage() {}
function downvoteImage() {}

function favoriteImage() {}

function deleteComment() {}



var vueRoot = new Vue(
  {
    el: '#app-container',
    data: {
      account: account,
      viewedImageData: viewedImageData
    }
  }
);
