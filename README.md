README FOR CS3500 FINAL PROJECT
Image Hosting Site

website url: http://imgshare3500.herokuapp.com/

PRIVATE LOGIN FOR HEROKU:
email: matthew.w.davis@wmich.edu
password: pepeSan007#

ADVISORY: this login information is tied to my credit card and as such is EXTREMELY SENSITIVE. PLEASE DO NOT DISTRIBUTE THIS README TO ANYONE!

All of the project files and work history can be found on https://github.com/CS3500-Final-Project/database

Instructions for viewing:
Simply go to http://imgshare3500.herokuapp.com/ and you will land on the frontpage, which displays images in order of popularity (how man +votes it
 has). Clicking anything that requires you to be registered will redirect you to the login page, from their you can create and account or log in
 through a sample account such as:
username: marfaxor
password: thecheat006

Once logged in you can view your account details, upload, and vote on images.

Resources used:
-Our web hosting is through Heroku
-Symfony/Silex: PHP framework
-Vue.js: Javascript framework
-Cloudinary: cloud service for storage of image files, we implemented their upload widget api
-Postgres: SQL database that we used to manage our image and user data
-Composer: used for managing dependancies
-Heroku Logs: used for serverside debugging

Additional information:
This project is extensive and relies heavily on php. No templates were used and everything was hard coded by us except for the cloudinary
uploadwidget api of course.

Noteworthy Files:
All of our work is in imgshare3500/web and the child folder of that directory. The files in the root directory are generated using composer for
dependancy management.
-Index.php: the core of the website. The php in this file handles all of the server-side operations
-accout-pages: this file contains all of the client-side files for account login, creation, and management.
-frontpage.html: contains the html and javascript for the landing page
-upload.html: contains the html for the upload page
-upload.js: contains js for uploading, including server calls




	
