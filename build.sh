#!/bin/bash

MVN_OPTS="-Duser.home=/var/maven -T 4"

if [ ! -e node_modules ]
then
  mkdir node_modules
fi

case `uname -s` in
  MINGW*)
    USER_UID=1000
    GROUP_UID=1000
    ;;
  *)
    if [ -z ${USER_UID:+x} ]
    then
      USER_UID=`id -u`
      GROUP_GID=`id -g`
    fi
esac

# If DEBUG env var is set to "true" then set -x to enable debug mode
if [ "$DEBUG" == "true" ]; then
	set -x
	EDIFICE_CLI_DEBUG_OPTION="--debug"
else
	EDIFICE_CLI_DEBUG_OPTION=""
fi

init() {
  me=`id -u`:`id -g`
  echo "DEFAULT_DOCKER_USER=$me" > .env

  # If CLI_VERSION is empty set to latest
  if [ -z "$CLI_VERSION" ]; then
    CLI_VERSION="latest"
  fi
  # Create a build.compose.yaml file from following template
  cat <<EOF > build.compose.yaml
services:
  edifice-cli:
    image: opendigitaleducation/edifice-cli:$CLI_VERSION
    user: "$DEFAULT_DOCKER_USER"
EOF
  # Copy /root/edifice from edifice-cli container to host machine
  docker compose -f build.compose.yaml create edifice-cli
  docker compose -f build.compose.yaml cp edifice-cli:/root/edifice ./edifice
  docker compose -f build.compose.yaml rm -fsv edifice-cli
  rm -f build.compose.yaml
  chmod +x edifice
  ./edifice version $EDIFICE_CLI_DEBUG_OPTION
}

clean () {
  docker-compose run --rm maven mvn $MVN_OPT clean
}

# Node

buildNode () {
  case `uname -s` in
    MINGW*)
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --production=false --no-bin-links && node_modules/gulp/bin/gulp.js build && yarn run build:sass"
      ;;
    *)
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --production=false && node_modules/gulp/bin/gulp.js build && yarn run build:sass"
  esac
}

formulaire:buildNode() {
  case $(uname -s) in
  MINGW*)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --production=false --no-bin-links && node_modules/gulp/bin/gulp.js build --targetModule=formulaire && yarn run build:sass"
    ;;
  *)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --production=false && node_modules/gulp/bin/gulp.js build --targetModule=formulaire && yarn run build:sass"
    ;;
  esac
}

formulairePublic:buildNode() {
  case $(uname -s) in
  MINGW*)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --production=false --no-bin-links && node_modules/gulp/bin/gulp.js build --targetModule=formulaire-public && yarn run build:sass"
    ;;
  *)
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --production=false && node_modules/gulp/bin/gulp.js build --targetModule=formulaire-public && yarn run build:sass"
    ;;
  esac
}

testNode() {
  rm -rf coverage
  rm -rf */build
  case `uname -s` in
    MINGW*)
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --no-bin-links && node_modules/gulp/bin/gulp.js drop-cache && yarn test"
      ;;
    *)
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install && node_modules/gulp/bin/gulp.js drop-cache && yarn test"
    esac
}

testNodeDev () {
  rm -rf coverage
  rm -rf */build
  case `uname -s` in
    MINGW*)
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install --no-bin-links && node_modules/gulp/bin/gulp.js drop-cache && yarn run test:dev"
      ;;
    *)
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn install && node_modules/gulp/bin/gulp.js drop-cache && yarn run test:dev"
  esac
}

# CSS

buildCss() {
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "yarn run build:sass"
}

# Maven

install () {
  docker compose run --rm maven mvn $MVN_OPTS clean install -U -DskipTests
}

test () {
  docker compose run --rm maven mvn $MVN_OPTS test
}

# Gulp

buildGulp() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "node_modules/gulp/bin/gulp.js build"
}

formulaire:buildGulp() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "node_modules/gulp/bin/gulp.js build --targetModule=formulaire"
}

formulairePublic:buildGulp() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "node_modules/gulp/bin/gulp.js build --targetModule=formulaire-public"
}

# Publish

publish() {
  version=`docker compose run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout`
  level=`echo $version | cut -d'-' -f3`
  case "$level" in
    *SNAPSHOT) export nexusRepository='snapshots' ;;
    *)         export nexusRepository='releases' ;;
  esac
  docker compose run --rm  maven mvn  $MVN_OPTS -DrepositoryId=ode-$nexusRepository -DskipTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
}

publishNexus() {
  version=`docker compose run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout`
  level=`echo $version | cut -d'-' -f3`
  case "$level" in
    *SNAPSHOT) export nexusRepository='snapshots' ;;
    *)         export nexusRepository='releases' ;;
  esac
  docker compose run --rm  maven mvn  $MVN_OPTS -DrepositoryId=ode-$nexusRepository -Durl=$repo -DskipTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
}

# If .env file does not exist, run init
if [ ! -e .env ]; then
  init
fi

# Commands

for param in "$@"
do
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
    formulaire:buildNode)
      formulaire:buildNode
      ;;
    formulairePublic:buildNode)
      formulairePublic:buildNode
      ;;
    testNode)
      testNode
      ;;
    testNodeDev)
      testNodeDev
      ;;
    buildCss)
      buildCss
      ;;
    test)
      test
      ;;
    buildGulp)
      buildGulp
      ;;
    formulaire:buildGulp)
      formulaire:buildGulp
      ;;
    formulairePublic:buildGulp)
      formulairePublic:buildGulp
      ;;
    install)
      buildNode && install
      ;;
    publish)
      publish
      ;;
    publishNexus)
      publishNexus
      ;;
    formulaire)
      formulaire:buildNode && formulaire:buildGradle
      ;;
    formulairePublic)
      formulairePublic:buildNode && formulairePublic:buildGradle
      ;;
    test)
      testNode ; test
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done
