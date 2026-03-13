# t3footnotes
TYPO3 extension to add footnotes to TYPO3's integrated RTE CKEditor

## Use of this plugin

#### Install over the composer
```
"repositories": [
  ...
  {
    "type": "git",
    "url": "https://github.com/connecta-ag/t3footnotes"
  },
  ...
],
```
```
"require": {
  ...
  "cag/t3footnotes": "dev-master",
  ...
},
```

#### Add TypoScript configuration

As include in your main template (setup, constants)

Contants
```
# include t3footnotes base contants
@import 'EXT:t3footnotes/Configuration/TypoScript/constants.typoscript'
```
Setup
```
# include original t3t3footnotes base typoscript
@import 'EXT:t3footnotes/Configuration/TypoScript/setup.typoscript'
```

or over Include Static Templates in DB-Typoscript-Template

#### Add JS-Plugin Configuration and button to your RTE Configuration

```
imports:
  # Import Footnotes RTE Plugin Configuration
  - { resource: "EXT:t3footnotes/Configuration/RTE/Plugin.yaml"}

editor:
  config:
    toolbar:
      items:
        - T3Footnotes
```


### Implement t3footnotes plugin in all templates you need

Use in Templates to create a container for printing out of footnotes

```<f:cObject typoscriptObjectPath="lib.t3footnotes" />```

