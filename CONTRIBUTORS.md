`crocks` Contributor's Guide
---
Thank you for your interest in contributing to `crocks`. This is just a quick
guide to help you get started with hacking on this project. We look forward to
reviewing your submitted Pull Requests! :tada: :cake: :balloon:

## Using the development environment
To get started, first thing you'll want to do, is clone the `crocks` repository
down to your local development machine. `crocks`, by design, only has
development dependencies. That means, there is no need to use `yarn` for
locking, but it would not hurt to use it. For convenience, the commands in this
document will use `npm`, but they can be replaced with the `yarn` equivalents if
you so desire.

Once everything is pulled down, you will want to install the development
dependencies by running the following in the project folder:

```
$ npm run setup
```

Once that is done cooking, you should be good to go and ready to run some of the
provided scripts used to aid the development process. Below is a list of the
common commands that can be leveraged by the typical contributor:

### Linting
Part of the continuous integration is a lint check using `eslint`. If the code
does not pass the linter, it will fail the build and cannot be merged if a Pull
Request is submitted. It is recommended to run the linter occasionally to verify
you are coding in the desired style. The configuration for use in some IDEs that
support `eslint`, can be found in the default `.eslintrc` file located in the
project directory. When developing, it is recommended to use the following
command in the project directory:

```
$ npm run lint:dev
```

### Specs
Specs are a big part of making sure a framework as large and interdependent as
`crocks` can ship with little chance of regression. As such, it is required to
maintain 100% coverage at all times. This includes having specs for each
logical branch, exception and every possible input to a function as possible.
In order to let you know when you may be implementing a breaking change that
could ripple throughout the system, a development spec runner can be utilized.
It is recommended to keep a terminal instance running the spec runner open while
developing. Anytime a source or spec file is saved, the runner will execute the
test suite and report failures. Like the linting, the specs will be ran through
the continuous integration system and will fail the build if any spec fails. So
it is important to make sure everything is passing and green before a Pull
Request is submitted. To run the spec runner, run the following in the project
directory:

```
$ npm run spec:dev
```

### Spec coverage
In order to verify that the base coverage is at 100%, `crocks` uses `nyc` to
report on code coverage. If every logical path through the code does not have a
matching spec, then the build will fail when a PR is submitted. `crocks`
provides a script that you can use to periodically check to see if you have the
base coverage implemented. When executed, this script will run your specs and
provide a coverage report and inform you of any lines of code that are missing
specs. To check for the current code coverage, run the following in the project
directory:

```
$ npm run spec:coverage
```

### Checking everything
It is recommended to run the same command that the continuous integration
process runs before submitting your Pull Request. This will alert you to any
potential issues with your proposed Pull Request before it is submitted. When
run, this command with first lint the code then if that passes the specs will
run, followed by the coverage report. If all of that passes with no error, then
you code should be ready to submit. To run this check, just execute the
following in the project folder:

```
$ npm test
```

### Working on Documentation
The system used by `crocks` to build the documentation
is [`electric.js`][electric]. The src for the documentation can be
found [in this folder][docs-loc]. To add documentation just add a markdown or
soy file within that directory structure where the file should reside.

When linking between files, make sure to match the case of the files in your
links. While case does not matter on OSX or Windows, the documentation runs on
a linux instance in it's production environment.

While putting together the documentation you plan to submit for review, it can
be helpful to use the built in build system to verify your work as you go. In
order to use the included build system, the latest JavaSDK needs to be available
on your system.

By running the following command, you can access a server that will build out the
documentation as you make changes, available
at [http://localhost:8888](http://localhost:8888):

```
$ npm run docs:dev
```

### Building TOC for README.md
When updates are done to the main `README.md` file, then the Table of Contents for
that file needs to be updated. Anytime changes are made to the `README.md` file
make sure to run the following before committing changes:

```
$ npm run doctoc
```

[electric]: https://electricjs.com/
[docs-loc]: https://github.com/evilsoft/crocks/tree/master/docs/src/pages/docs