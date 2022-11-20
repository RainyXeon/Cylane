@echo off

title Cylane [GLOBAL]

:StartBot

IF exist node_modules (
  echo Folder node_modules exists. Running bot...
  npm start
  goto StartBot
) ELSE (
  echo Folder node_modules does not exists. Running npm i command...
  npm i
  echo Running bot...
  npm start
  goto StartBot
)
