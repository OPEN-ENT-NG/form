#!/bin/bash

# Options
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

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <clean|init|localDep|build|install|watch>"
  echo "Example: $0 clean"
  echo "Example: $0 init"
  echo "Example: $0 localDep Use this option to update the edifice-ts-client NPM dependency with a local version"
  echo "Example: $0 build"
  echo "Example: $0 install"
  echo "Example: $0 [--springboard=recette] watch"
  exit 1
fi

if [ -z ${USER_UID:+x} ]
then
  export USER_UID=1000
  export GROUP_GID=1000
fi

# options
SPRINGBOARD="recette"
for i in "$@"
do
case $i in
    -s=*|--springboard=*)
    SPRINGBOARD="${i#*=}"
    shift
    ;;
    *)
    ;;
esac
done

clean () {
  rm -rf node_modules 
  rm -rf dist 
  rm -rf build 
  rm -rf .pnpm-store
  rm -f package.json 
  rm -f pnpm-lock.yaml
}

doInit () {
  echo "[init] Get branch name from jenkins env..."
  BRANCH_NAME=`echo $GIT_BRANCH | sed -e "s|origin/||g"`
  if [ "$BRANCH_NAME" = "" ]; then
    echo "[init] Get branch name from git..."
    BRANCH_NAME=`git branch | sed -n -e "s/^\* \(.*\)/\1/p"`
  fi

  echo "[init] Generate package.json from package.json.template..."
  NPM_VERSION_SUFFIX=`date +"%Y%m%d%H%M"`
  cp package.json.template package.json
  sed -i "s/%branch%/${BRANCH_NAME}/" package.json
  sed -i "s/%generateVersion%/${NPM_VERSION_SUFFIX}/" package.json

  if [ "$1" == "Dev" ]
  then
    sed -i "s/%packageVersion%/link:..\/..\/edifice-ts-client\//" package.json
  else
    sed -i "s/%packageVersion%/${BRANCH_NAME}/" package.json
  fi

  if [ "$NO_DOCKER" = "true" ] ; then
    pnpm install
  else
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm install"
  fi

}

init() {
  doInit
}

initDev() {
  doInit "Dev"
}

# Install local dependencies as tarball (installing as folder creates symlinks which won't resolve in the docker container)
localDep () {
  if [ -e $PWD/../edifice-ts-client ]; then
    rm -rf edifice-ts-client.tar edifice-ts-client.tar.gz
    mkdir edifice-ts-client.tar && mkdir edifice-ts-client.tar/dist \
      && cp -R $PWD/../edifice-ts-client/dist $PWD/../edifice-ts-client/package.json edifice-ts-client.tar
    tar cfzh edifice-ts-client.tar.gz edifice-ts-client.tar
    if [ "$NO_DOCKER" = "true" ] ; then
      pnpm install --no-save edifice-ts-client.tar.gz
    else
      docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm install --no-save edifice-ts-client.tar.gz"
    fi
    rm -rf edifice-ts-client.tar edifice-ts-client.tar.gz
  fi
}

installDeps() {
#  check_cert_docker_run_node --env TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN -- "pnpm install"
  TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm install"
}

runTest() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm test"
}

runDev() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm run dev"
}

prettierDocker() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm run format:write"
}

lintFixDocker() {
  docker-compose run --rm node sh -c "pnpm run fix"
}

checkQualityCode() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm run format:check && pnpm run lint"
}

runLocal() {
  docker-compose run --rm -u "$USER_UID:$GROUP_GID" node pnpm dev
}

build () {
  if [ "$NO_DOCKER" = "true" ] ; then
    TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN pnpm build
  else
    TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm build"
  fi
  status=$?
  if [ $status != 0 ];
  then
    exit $status
  fi
}

publishNPM () {
  LOCAL_BRANCH=`echo $GIT_BRANCH | sed -e "s|origin/||g"`
  if [ "$NO_DOCKER" = "true" ] ; then
    pnpm publish --tag $LOCAL_BRANCH
  else
    docker-compose run --rm -u "$USER_UID:$GROUP_GID" node sh -c "pnpm publish --tag $LOCAL_BRANCH"
  fi
}

publishMavenLocal (){
  mvn install:install-file \
    --batch-mode \
    -DgroupId=$MVN_MOD_GROUPID \
    -DartifactId=$MVN_MOD_NAME \
    -Dversion=$MVN_MOD_VERSION \
    -Dpackaging=tar.gz \
    -Dfile=${MVN_MOD_NAME}.tar.gz
}

check_cert_docker_run_node() {
  # Usage:
  # check_cert_docker_run_node [--env VAR1=VAL1 --env VAR2=VAL2 ...] -- command_to_run
  # Exemple :
  # check_cert_docker_run_node --env TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN -- "pnpm install"

  local CMD=()
  local ENV_VARS=()
  local CERT_PATH="$HOME/zscaler.crt"
  local CONTAINER_CERT_PATH="/tmp/zscaler.crt"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --env)
        ENV_VARS+=("-e" "$2")
        shift 2
        ;;
      --)
        shift
        CMD=("$@")
        break
        ;;
      *)
        echo "Unknown argument: $1"
        return 1
        ;;
    esac
  done

  if [ ${#CMD[@]} -eq 0 ]; then
    echo "Error: No command provided to run in container."
    return 1
  fi

  if [ -f "$CERT_PATH" ]; then
    echo "===== IN IF ====="
    local CERT_PATH="$HOME/zscaler.crt"
    local CONTAINER_CERT_PATH="/tmp/zscaler.crt"
    docker-compose run --rm "${ENV_VARS[@]}" -u "root:root" -v "$CERT_PATH:$CONTAINER_CERT_PATH:ro" node sh -c "\
      mkdir -p /usr/local/share/ca-certificates && \
      cp /tmp/zscaler.crt /usr/local/share/ca-certificates/zscaler.crt && \
      cat /usr/local/share/ca-certificates/*.crt >> /etc/ssl/certs/ca-certificates.crt && \
      apk update && apk add --no-cache ca-certificates && \
      update-ca-certificates --verbose --fresh && \
      NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/zscaler.crt wget -O test.html https://registry.npmjs.org/ && \
      NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/zscaler.crt ${CMD[*]}"
    echo "===== END IF ====="
  else
    echo "===== IN ELSE ====="
    docker-compose run --rm "${ENV_VARS[@]}" -u "$USER_UID:$GROUP_GID" node sh -c "${CMD[*]}"
  fi
}

for param in "$@"
do
  case $param in
    clean)
      clean
      ;;
    init)
      init
      ;;
    initDev)
      initDev
      ;;
    localDep)
      localDep
      ;;
    initLocal)
      runLocal
      ;;
    runLocal)
      runLocal
      ;;
    runDev)
      runDev
      ;;
    installDeps)
      installDeps
      ;;
    runTest)
      runTest
      ;;
    runDev)
      runDev
      ;;
    prettierDocker)
      prettierDocker
      ;;
    lintFixDocker)
      lintFixDocker
      ;;
    checkQualityCode)
      checkQualityCode
      ;;
    build)
      build
      ;;
    install)
      build && archive && publishMavenLocal && rm -rf build
      ;;
    watch)
      watch
      ;;
    archive)
      archive
      ;;
    publishNPM)
      publishNPM
      ;;
    lintAndFormat)
      lintFixDocker && prettierDocker
      ;;
    *)
      echo "Invalid argument : $param"
  esac
  if [ ! $? -eq 0 ]; then
    exit 1
  fi
done