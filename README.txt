********************************************************
Crossover application test for Sr Front End Web Designer
********************************************************
Author: Waldir J. Pereira Junior
E-mail: waldirpereira@gmail.com
Date:   2016-09-23
********************************************************

--------------------------------------------------------
Introduction
--------------------------------------------------------
In this file I will try to show the architecture of the application and the mainly features I've 
developed. There are three features:
    + List elements
    + Read me
    + Test runner

The first two features work as a Single Page Application, with ngRoute for route managing.
The last one (test runner) is an independent feature, but also uses the "menu" directive.
	
--------------------------------------------------------
How to run
--------------------------------------------------------
Just copy all files inside the "Code" folder to a website root and run the site.
For exemple: http://localhost

Obs.: Assuming that "index.html" is the default start page for the webserver.

If opened with Visual Studio with the "Crossover.sln" file, just run the application and the browser
will open with website loaded on URL http://localhost:58757

--------------------------------------------------------
Structure
--------------------------------------------------------
+ index.html
+ README.txt
+ test.html
+ content
    + css
        + app
        + vendor
            + ...
    + images
        + app
    + templates
+ json
+ scripts
    + app
        + element
        + readme
    + vendor
        + ...
+ test
    + lib
    + scripts
    + spec
	
--------------------------------------------------------
index.html
--------------------------------------------------------
Application main page. In there we have the features of the elements list using AngularJS 1.5.
I wrote 3 inline templates (with ng-template) for the these features:
	- list.html --> for the list of elements (the mainly problem itself)
	- modal.html --> for the popup with the element details
	- readme.html --> for showing the README.txt file

--------------------------------------------------------
README.txt
--------------------------------------------------------
The file you are reading.

--------------------------------------------------------
test.html
--------------------------------------------------------
The file that runs the test specification.

--------------------------------------------------------
'content' folder
--------------------------------------------------------
This folder contains all CSS, images and templates for the application.

--------------------------------------------------------
'json' folder
--------------------------------------------------------
This folder contains some mocks for the service calls, that simulate the response for several server calls.
For example, there is a "elements.js" who represents the "getAll" action who backend should have.

--------------------------------------------------------
'scripts' folder
--------------------------------------------------------
Contains all JavaScript files for the application features (without tests).
This folder is divided by "app" and "vendor" subfolders, each one has more subdivisions for each feature.
In "app" subfolder there are the following files and subfolders:
    + cong.module.js: definition for the mainly application module "cong" and "route" configuration
    + cong.template.service.js: AngularJS service for reading a template from file system
    + cong.menu.js: AngularJS directive for the menu that is used by all pages
    + "element" folder: with all AngularJS files for "element" feature
        + cong.element.module.js: definition for "cong.element" module
        + cong.element.service.js: definition for the service who will make the POST requests for the server
            --> **IMPORTANT**: note the "get" method I put a "randomized timeout" (1 second in maximum) for response.
                               With this I simulate the server response gap and show a "Loading" warning for the user.
        + cong.element.components.js: a set of components to use in the elements list page, such as "progressbox", 
          "detailbox" and "boxtitle"
        + cong.element.controller.js: the elements list page controller
	    + cong.element.modal.controller.js: the controller for the details popup
    + "readme" folder: with all AngularJS files for "readme" feature
        + cong.readme.directive.js: a directive to replace the element "cong-readme" with a "PRE" element containing 
          this file content.
        + cong.readme.controller.js: the simple controller for the readme page.

In "vendor" subfolder there are the following subfolders with the most up-to-date versions of each component/framework:
    + angular
    + angular-chart.js
    + angular-ui
    + bootstrap
    + charts.js
    + jquery

--------------------------------------------------------
'test' folder
--------------------------------------------------------
This folder contains three subfolders:
    + lib: with "jasmine" files
    + scripts: with "cong-test-result.js", that is a directive for move the test results to a appropriate "DIV" element,
      just for UX purpose.
    + spec: with the Jasmine specification file for the tests.
