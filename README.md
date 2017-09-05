# Conduit's Bootstrap [(see it live on GH pages)](http://gothinkster.github.io/conduit/)

1.  Pull repo  
2.  Run `yarn start` or `npm run start`

## PROJECT STRUCTURE
The structure of the project prefer a good separation from the source to what is the deployable package.

Outlining a basic folder structure with three main folders for this project.
* `src/`: for all of your source files (njk, scss)
* `dist/`: for the processed, bundled and minified production files
* `.tmp/`: directory which will be used as the sandbox for our local web server.

```BASH
/
- dist/
- src/
  - pages/
  - templates/
     - partials/
     - macros/
     ...
  - resources/
- .tmp/
```

* `pages/`: it is where we are going to add all our files that are rendered to final pages.
* `templates/partials/`: contains all the included files.
* `templates/macros/`: contains all the macros files.
* `templates/`: the root folder is the perfect place to contain base layouts.

**Note**: There is no real need for it but I used `.njk` as extension for all the *src* files used by *nunjucks*.


'!templates/base.html'
