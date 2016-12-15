mkroosevelt [![NPM version](https://badge.fury.io/js/mkroosevelt.png)](http://badge.fury.io/js/mkroosevelt) [![Dependency Status](https://gemnasium.com/kethinov/mkroosevelt.png)](https://gemnasium.com/kethinov/mkroosevelt) [![Gittip](http://img.shields.io/gittip/kethinov.png)](https://www.gittip.com/kethinov/)
===

Command line application for creating [Roosevelt](https://github.com/kethinov/roosevelt) apps.

Getting Started
---

Globally Install `yo` and `mkroosevelt`

```
npm install -g yo mkroosevelt
```

Create a new directory you would like the roosevelt application to be created in and navigate to it.

```
mkdir newRooseveltApp
cd newRooseveltApp
```

Create a new roosevelt application using mkroosevelt command which is a [yeoman generator](http://yeoman.io/).

```
mkroosevelt nameOfNewApp
```

Then follow on screen prompts.

*Note*:

* For most users the standard install is the recommened option.

* Any of the options configured in the advanced install can be edited later in the `package.json` file.

Usage
---

Create an app in the current directory:

```
mkroosevelt nameOfNewApp
```

Output current version:

```
mkroosevelt -v, -version, --v, --version
```

Generate ssl certificate and key for https server:

```
mkroosevelt -genssl, --genssl
```


![Teddy Roosevelt's facial hair is a curly brace.](https://raw.github.com/kethinov/mkroosevelt/master/sampleApp/statics/images/teddy.jpg "Teddy Roosevelt's facial hair is a curly brace.")