#!/bin/bash

MVN_OPTS="-Duser.home=/var/maven"

# Params
NO_DOCKER=""
for i in "$@"
do
case $i in
  --no-docker*)
  NO_DOCKER="true"
  shift
  ;;
  *)
  ;;
esac
done

case `uname -s` in
  MINGW* | Darwin*)
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

prepare_docker() {
  # Copie temporaire du pom.xml parent dans le répertoire backend + modif du pom.xml enfant
  cp ../pom.xml pom-parent.xml
  sed -i 's|<relativePath>../pom.xml</relativePath>|<relativePath>./pom-parent.xml</relativePath>|' pom.xml
}

rollback_docker_preparation() {
  # Rollback des opérations pré-build
  sed -i 's|<relativePath>./pom-parent.xml</relativePath>|<relativePath>../pom.xml</relativePath>|' pom.xml
  rm pom-parent.xml
}

# Nettoyage du dossier `backend`
clean() {
  echo "Cleaning..."
  prepare_docker
  if [ "$NO_DOCKER" = "true" ] ; then
    mvn $MVN_OPTS clean
  else
    docker compose run --rm maven mvn $MVN_OPTS clean
  fi
  rollback_docker_preparation
  echo "Clean done!"
}

build() {
  echo "Building..."
  prepare_docker
  if [ "$NO_DOCKER" = "true" ] ; then
    mvn $MVN_OPTS install -DskipTests
  else
    docker compose run --rm maven mvn $MVN_OPTS install -DskipTests
  fi
  rollback_docker_preparation
  echo "Build done!"
}

publish() {
  prepare_docker
  version=`docker-compose run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout`
  level=`echo $version | cut -d'-' -f3`
  case "$level" in
      *SNAPSHOT)
          export nexusRepository='snapshots'
          ;;
      *)
          export nexusRepository='releases'
          ;;
  esac
  if [ "$NO_DOCKER" = "true" ] ; then
    mvn -DrepositoryId=ode-$nexusRepository -DskiptTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
  else
    docker-compose run --rm maven mvn -DrepositoryId=ode-$nexusRepository -DskiptTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
  fi
  rollback_docker_preparation
}

publishNexus() {
  prepare_docker
  version=`docker compose run --rm maven mvn $MVN_OPTS help:evaluate -Dexpression=project.version -q -DforceStdout`
  level=`echo $version | cut -d'-' -f3`
  case "$level" in
    *SNAPSHOT) export nexusRepository='snapshots' ;;
    *)         export nexusRepository='releases' ;;
  esac
  docker compose run --rm  maven mvn -DrepositoryId=ode-$nexusRepository -Durl=$repo -DskipTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml deploy
  rollback_docker_preparation
}

for param in "$@"
do
  case $param in
    clean)
      clean
      ;;
    install)
      build
      ;;
    publish)
      publish
      ;;
    publishNexus)
      publishNexus
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done