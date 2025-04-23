#!/bin/bash

MVN_OPTS="-Duser.home=/var/maven"


if [ ! -e node_modules ]; then
  mkdir node_modules
fi

case $(uname -s) in
MINGW*)
  USER_UID=1000
  GROUP_UID=1000
  ;;
*)
  if [ -z ${USER_UID:+x} ]; then
    USER_UID=$(id -u)
    GROUP_GID=$(id -g)
  fi
  ;;
esac

init() {
  me=`id -u`:`id -g`
  echo "DEFAULT_DOCKER_USER=$me" > .env
}

clean () {
  docker-compose run --rm maven mvn $MVN_OPT clean
}

test () {
  docker compose run --rm maven mvn $MVN_OPTS test
}

install () {
  formulaire && formulairePublic;
}

publish() {
  version=`docker compose run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout`
  level=`echo $version | cut -d'-' -f3`
  case "$level" in
    *SNAPSHOT) export nexusRepository='snapshots' ;;
    *)         export nexusRepository='releases' ;;
  esac
  docker compose run --rm  maven mvn -DrepositoryId=ode-$nexusRepository -DskipTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
}

formulaire() {
  # build angular front
  cd formulaire/angular
  ./build.sh buildNode
  cd ../..

  # build react front
  cd formulaire/frontend
  ./build.sh installDeps build
  cd ../..

  # build backend 
  ## clear before adding static content
  rm -rf formulaire/backend/src/main/resources/public/css
  rm -rf formulaire/backend/src/main/resources/public/img
  rm -rf formulaire/backend/src/main/resources/public/js
  rm -rf formulaire/backend/src/main/resources/public/mdi
  rm -rf formulaire/backend/src/main/resources/public/template
  rm -rf formulaire/backend/src/main/resources/view
  
  ## Create view directory and copy HTML files into Backend
  mkdir -p formulaire/backend/src/main/resources/public/css
  mkdir -p formulaire/backend/src/main/resources/public/img
  mkdir -p formulaire/backend/src/main/resources/public/js
  mkdir -p formulaire/backend/src/main/resources/public/mdi
  mkdir -p formulaire/backend/src/main/resources/public/template
  mkdir -p formulaire/backend/src/main/resources/view

  ## add static angularjs files to formulaire backend
  cp -R formulaire/angular/src/css/* formulaire/backend/src/main/resources/public/css
  cp -R formulaire/angular/src/img/* formulaire/backend/src/main/resources/public/img
  cp -R formulaire/angular/src/dist/* formulaire/backend/src/main/resources/public/js
  cp -R formulaire/angular/src/mdi/* formulaire/backend/src/main/resources/public/mdi
  cp -R formulaire/angular/src/i18n/* formulaire/backend/src/main/resources/i18n
  cp -R formulaire/angular/src/template/* formulaire/backend/src/main/resources/public/template
  cp -R formulaire/angular/src/view/* formulaire/backend/src/main/resources/view

  ## add static reactjs files to formulaire backend
  cp -R formulaire/frontend/dist/* formulaire/backend/src/main/resources
  cp -R formulaire/frontend/public/* formulaire/backend/src/main/resources/public
  mv formulaire/backend/src/main/resources/*.html formulaire/backend/src/main/resources/view
  cp -R formulaire/backend/src/main/resources/view-src/* formulaire/backend/src/main/resources/view

  formulaire:buildMaven;
}

formulairePublic() {
  # build angular front
  cd formulaire-public/angular
  ./build.sh buildNode
  cd ../..

  # build react front
  cd formulaire-public/frontend
  ./build.sh installDeps build
  cd ../..

  # build backend 
  ## clear before adding static content
  rm -rf formulaire-public/backend/src/main/resources/public/css
  rm -rf formulaire-public/backend/src/main/resources/public/img
  rm -rf formulaire-public/backend/src/main/resources/public/js
  rm -rf formulaire-public/backend/src/main/resources/public/mdi
  rm -rf formulaire-public/backend/src/main/resources/public/template
  rm -rf formulaire-public/backend/src/main/resources/view
  
  ## Create view directory and copy HTML files into Backend
  mkdir -p formulaire-public/backend/src/main/resources/public/css
  mkdir -p formulaire-public/backend/src/main/resources/public/img
  mkdir -p formulaire-public/backend/src/main/resources/public/js
  mkdir -p formulaire-public/backend/src/main/resources/public/mdi
  mkdir -p formulaire-public/backend/src/main/resources/public/template
  mkdir -p formulaire-public/backend/src/main/resources/view

  ## add static angularjs files to formulaire-public backend
  cp -R formulaire-public/angular/src/css/* formulaire-public/backend/src/main/resources/public/css
  cp -R formulaire-public/angular/src/img/* formulaire-public/backend/src/main/resources/public/img
  cp -R formulaire-public/angular/src/dist/* formulaire-public/backend/src/main/resources/public/js
  cp -R formulaire-public/angular/src/mdi/* formulaire-public/backend/src/main/resources/public/mdi
  cp -R formulaire-public/angular/src/i18n/* formulaire-public/backend/src/main/resources/i18n
  cp -R formulaire-public/angular/src/template/* formulaire-public/backend/src/main/resources/public/template
  cp -R formulaire-public/angular/src/view/* formulaire-public/backend/src/main/resources/view

  ## add static reactjs files to formulaire backend
  cp -R formulaire-public/frontend/dist/* formulaire-public/backend/src/main/resources
  cp -R formulaire-public/frontend/public/* formulaire-public/backend/src/main/resources/public
  mv formulaire-public/backend/src/main/resources/*.html formulaire/backend/src/main/resources/view
  cp -R formulaire-public/backend/src/main/resources/view-src/* formulaire/backend/src/main/resources/view

  formulairePublic:buildMaven;
}

formulaire:buildMaven() {
  docker-compose run --rm maven mvn $MVN_OPTS -pl formulaire/backend -am install -DskipTests
}

formulairePublic:buildMaven() {
  docker-compose run --rm maven mvn $MVN_OPTS -pl formulaire-public/backend -am install -DskipTests
}

publishNexus() {
  version=`docker compose run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout`
  level=`echo $version | cut -d'-' -f3`
  case "$level" in
    *SNAPSHOT) export nexusRepository='snapshots' ;;
    *)         export nexusRepository='releases' ;;
  esac
  docker compose run --rm  maven mvn -DrepositoryId=ode-$nexusRepository -Durl=$repo -DskipTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
}

for param in "$@"; do
  case $param in
  init)
    init
    ;;
  clean)
    clean
    ;;
  buildNode)
    buildNode
    ;;
  install)
    install
    ;;
  publish)
    publish
    ;;
  publishNexus)
    publishNexus
    ;;
  test)
    testNode ; test
    ;;
  testNode)
    testNode
  ;;
  testNodeDev)
    testNodeDev
  ;;
  testMaven)
    test
    ;;
  formulaire)
    formulaire
    ;;
  formulairePublic)
    formulairePublic
    ;;
  formulaire:buildMaven)
    formulaire:buildMaven
    ;;
  formulairePublic:buildMaven)
    formulairePublic:buildMaven
    ;;
  *)
    echo "Invalid argument : $param"
    ;;
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done