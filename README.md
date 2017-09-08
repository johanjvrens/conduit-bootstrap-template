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

[link](https://mozilla.github.io/nunjucks/)
[link](https://adonisjs.com/docs/3.2/templating)
[link](https://zellwk.com/blog/nunjucks-with-gulp/)
[link](https://nystudio107.com/blog/a-gulp-workflow-for-frontend-development-automation)
[link](https://nystudio107.com/blog/a-better-package-json-for-the-frontend)
[link](https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc)
[link](https://css-tricks.com/killer-features-of-nunjucks/)
[link](https://css-tricks.com/component-led-design-patterns-nunjucks-grunt/)
[link](http://alferov.github.io/awesome-gulp/)
[link](https://css-tricks.com/gulp-for-beginners/)
[link](https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885)
[link](https://workboxjs.org/get-started/gulp.html)

[link](https://medium.freecodecamp.org/the-anatomy-of-a-bootstrap-dashboard-that-earns-1-000s-each-month-ed3404010d25)
[link](https://medium.com/@programmiri/my-favored-scss-setup-with-bootstrap-4-547e9ea290f8)
