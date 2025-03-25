#!/bin/bash

chmod +x angular/build.sh
chmod +x frontend/build.sh
chmod +x backend/build.sh

# Angular functions
build_angular() {
  echo -e '\n---------------'
  echo 'Build AngularJS'
  echo '---------------'
  cd angular || exit 1
  ./build.sh buildNode
  rm -rf common
  cd .. || exit 1
}

copy_angular_files() {
  cp -R ../angular/src/css/* ./src/main/resources/public/css
  cp -R ../angular/src/img/* ./src/main/resources/public/img
  cp -R ../angular/src/dist/* ./src/main/resources/public/js
  cp -R ../angular/src/mdi/* ./src/main/resources/public/mdi
  cp -R ../angular/src/template/* ./src/main/resources/public/template
  cp -R ../angular/src/view/* ./src/main/resources/view

  # Copy '.html' files in 'ts' folder
  cd ../angular/src/ts || exit 1 # Need to be in targeted directory for rsync command to work
  shopt -s globstar # Active '**/' for recursivity on next line
  rsync -R **/*.html ../../../backend/src/main/resources/public/ts --relative --no-implied-dirs
  cd ../../../backend || exit 1
}

clean_angular() {
  rm -rf angular/node_modules
  rm -rf angular/*.lock
  rm -rf angular/src/css
  rm -rf angular/src/dist
  rm -rf angular/src/js
  rm -rf angular/src/mdi
  rm -rf angular/src/view
}
# End Angular functions

clean_frontend() {
  echo 'clean_frontend() TODO'
}

clean_backend() {
  echo -e '\n------------------'
  echo 'Clean before build'
  echo '------------------'
  cd backend || exit 1
  rm -rf .flattened-pom.xml
  rm -rf pom-parent.xml
  rm -rf src/main/resources/img
  rm -rf src/main/resources/public
  rm -rf src/main/resources/view
  echo 'Repo clean for build !'
  cd .. || exit 1
}

build_frontend() {
  echo -e '\n--------------'
  echo 'Build Frontend'
  echo '--------------'
  cd frontend || exit 1
  ./build.sh clean installDeps build
  cd .. || exit 1
}

prepare_backend() {
  cd backend || exit 1
  mkdir -p ./src/main/resources/public/css
  mkdir -p ./src/main/resources/public/img
  mkdir -p ./src/main/resources/public/js
  mkdir -p ./src/main/resources/public/mdi
  mkdir -p ./src/main/resources/public/template
  mkdir -p ./src/main/resources/public/ts
  mkdir -p ./src/main/resources/view
  cd .. || exit 1
}

# Function to copy frontend files to backend
copy_frontend_files() {
  echo -e '\n--------------------'
  echo 'Copy front files built'
  echo '----------------------'
  cd backend || exit 1

  # Copy Frontend files
  cp -R ../frontend/public/* ./src/main/resources/public
  cp -R ../frontend/dist/* ./src/main/resources
  mv ./src/main/resources/*.html ./src/main/resources/view

  copy_angular_files

  echo 'Files all copied !'
  cd .. || exit 1
}

# Function to build backend
build_backend() {
  echo -e '\n-------------'
  echo 'Build Backend'
  echo '-------------'
  cd backend || exit 1
  ./build.sh clean install
  cd .. || exit 1
}

install() {
  clean_backend
  build_angular
  build_frontend
  prepare_backend
  copy_frontend_files
  build_backend
}

lint() {
  cd frontend || exit 1
  ./build.sh lintFixDocker prettierDocker
  cd .. || exit 1
}

test_frontend() {
  echo -e '\n--------------'
  echo 'Test Frontend'
  echo '--------------'
  cd frontend || exit 1
  ./build.sh runTest
  cd .. || exit 1
}

test_backend() {
  echo -e '\n-------------'
  echo 'Test Backend'
  echo '-------------'
  cd backend || exit 1
  ./build.sh test
  cd .. || exit 1
}

# Main function to handle multiple arguments
main() {
  for arg in "$@"; do
    case "$arg" in
      cleanFront)
        clean_frontend
        ;;
      cleanBack)
        clean_backend
        ;;
      clean)
        clean_frontend && clean_backend
        ;;
      buildFront)
        build_frontend
        ;;
      buildBack)
        build_backend
        ;;
      install)
        install
        ;;
      lint)
        lint
        ;;
      testFront)
        test_frontend
        ;;
      testBack)
        test_backend
        ;;
      test)
        test_frontend && test_backend
        ;;
      *)
        echo "Invalid argument: $arg"
        echo "Usage: ./build.sh [install|buildBack|buildFront|clean|testBack|testFront|test]"
        exit 1
        ;;
      esac
  done
}

# Call the main function with all arguments
main "$@"