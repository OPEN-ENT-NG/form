#!/bin/bash

chmod +x formulaire/build.sh
chmod +x formulaire-public/build.sh

install_formulaire() {
  echo -e '\n------------------'
  echo 'Install Formulaire'
  echo '------------------'
  cd formulaire || exit 1
  ./build.sh install
  echo 'Formulaire build !'
  cd .. || exit 1
}

install_formulaire_public() {
  echo -e '\n------------------'
  echo 'Install Formulaire-public'
  echo '------------------'
  cd formulaire-public || exit 1
  ./build.sh install
  echo 'Formulaire-public  build !'
  cd .. || exit 1

}

install() {
  install_formulaire
  install_formulaire_public
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