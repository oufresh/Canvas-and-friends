module.exports = require('babel-jest').createTransformer({
  presets: [
    "env", 
    "react"
  ],
  plugins: [
    "syntax-class-properties",
    "transform-object-rest-spread",
    "transform-class-properties"
  ],
});