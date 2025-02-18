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
}

clean_angular() {
  rm -rf angular/src/css
  rm -rf angular/src/dist
  rm -rf angular/src/js
  rm -rf angular/src/mdi
  rm -rf angular/src/view
}
# End Angular functions

# Function to clean backend files
clean_backend() {
  echo -e '\n------------------'
  echo 'Clean before build'
  echo '------------------'
  cd backend || exit 1
  rm -rf ./target
  rm -rf ./flattened-pom.xml
  rm -rf ./pom-parent.xml
  rm -rf ./src/main/resources/public
  rm -rf ./src/main/resources/view
  echo 'Repo clean for build !'
  cd .. || exit 1
}

# Function to build frontend
build_frontend() {
  echo -e '\n--------------'
  echo 'Build Frontend'
  echo '--------------'
  cd frontend || exit 1
  ./build.sh installDeps build
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

prepare_backend() {
  # Prepare backend/resources
  mkdir -p ./src/main/resources/public/css
  mkdir -p ./src/main/resources/public/img
  mkdir -p ./src/main/resources/public/js
  mkdir -p ./src/main/resources/public/mdi
  mkdir -p ./src/main/resources/public/template
  mkdir -p ./src/main/resources/view
}

# Function to copy frontend files to backend
copy_frontend_files() {
  echo -e '\n--------------------'
  echo 'Copy front files built'
  echo '----------------------'
  cd backend || exit 1

  prepare_backend

  # Copy Frontend files
  cp -R ../frontend/public/* ./src/main/resources/public
  cp -R ../frontend/dist/* ./src/main/resources
  mv ./src/main/resources/*.html ./src/main/resources/view
  cp -R ./src/main/resources/view-src/* ./src/main/resources/view

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
  ./build.sh clean build
  cd .. || exit 1
}

# Function to test backend
test_backend() {
  echo -e '\n-------------'
  echo 'Test Backend'
  echo '-------------'
  cd backend || exit 1
  ./build.sh test
  cd .. || exit 1
}

# Function to clean frontend folders
clean_frontend_folders() {
  echo -e '\n-------------'
  echo 'Clean front folders'
  echo '-------------'
  rm -rf frontend/dist
  clean_angular
  echo 'Folders cleaned !'
}

# Function to handle the install command
install() {
  clean_backend
  build_angular
#  build_frontend
  prepare_backend
  copy_frontend_files
  build_backend
  clean_frontend_folders
}

# Main function to handle multiple arguments
main() {
  for arg in "$@"; do
    case "$arg" in
      install)
        install
        ;;
      buildBack)
        build_backend
        ;;
      buildFront)
        build_frontend
        ;;
      clean)
        clean_backend
        ;;
      testBack)
        test_backend
        ;;
      testFront)
        test_frontend
        ;;
      test)
        test_frontend
        test_backend
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