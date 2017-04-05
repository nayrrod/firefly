# Firefly

## See it live [here](https://lab-firefly.netlify.com)

## Context

This is an experiment on using three.js for a little (silly) storytelling. The original code was written when working with [Edouard Reinach](https://twitter.com/ereinach) for the homepage of Hypractif, which I slightly modified so it can stand on its own as a demo.

This was my first encounter with WebGL 2 years ago, so it can be a good learning resource on achieving interesting results with WebGL without too much technical knowledge.

The mountains model was kindly done by [Albert Zablit](https://twitter.com/albertzablit).

## Usage

Clone the repo, then :

### Install dependencies

```sh
yarn
```

or

```sh
npm install
```

### Run live-server

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Caveats

Reloading the page could pretty much murder your computer fans. This could be due to a version mismatch between the exported model and three.js. I don't have access to the original model, so dead fans it is ... sorry.

### Licenses

For the software, see LICENSE.MD

The model is licensed under the Creative Commons Attribution 4.0 International License.(c) Albert Zablit. To view a copy of this license, visit <http://creativecommons.org/licenses/by/4.0/>.
