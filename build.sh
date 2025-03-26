#!/bin/bash

chmod +x common/build.sh
chmod +x formulaire/build.sh
chmod +x formulaire-public/build.sh


clean:formulaire() {
  cd formulaire || exit 1
  ./build.sh clean
  cd .. || exit 1
}

clean:formulairePublic() {
  cd formulaire-public || exit 1
  ./build.sh clean
  cd .. || exit 1
}

clean() {
  clean:formulaire
  clean:formulairePublic
}

buildCommon() {
  cd common || exit 1
  ./build.sh install
  cd .. || exit 1
}

buildFront:formulaire() {
  cd formulaire || exit 1
  ./build.sh buildFront
  cd .. || exit 1
}

buildFront:formulairePublic() {
  cd formulaire-public || exit 1
  ./build.sh buildFront
  cd .. || exit 1
}

buildFront() {
  buildFront:formulaire
  buildFront:formulairePublic
}

buildBack:formulaire() {
  cd formulaire || exit 1
  ./build.sh buildBack
  cd .. || exit 1
}

buildBack:formulairePublic() {
  cd formulaire-public || exit 1
  ./build.sh buildBack
  cd .. || exit 1
}

buildBack() {
  buildBack:formulaire
  buildBack:formulairePublic
}

install:formulaire() {
  echo -e '\n------------------'
  echo 'Install Formulaire'
  echo '------------------'
  cd formulaire || exit 1
  ./build.sh install
  echo -e '\n-------------'
  echo 'Formulaire build !'
  echo '------------------'
  cd .. || exit 1
}

install:formulairePublic() {
  echo -e '\n------------------'
  echo 'Install Formulaire-public'
  echo '------------------'
  cd formulaire-public || exit 1
  ./build.sh install
  echo -e '\n-------------'
  echo 'Formulaire-public  build !'
  echo '------------------'
  cd .. || exit 1
}

install() {
  install:formulaire
  install:formulairePublic
}

lint:formulaire() {
  cd formulaire || exit 1
  ./build.sh lint
  cd .. || exit 1
}

lint:formulairePublic() {
  cd formulaire-public || exit 1
  ./build.sh lint
  cd .. || exit 1
}

lint() {
  lint:formulaire
  lint:formulairePublic
}


# Main function to handle multiple arguments
main() {
  for arg in "$@"; do
    case "$arg" in
      clean)
        clean
        ;;
      buildCommon)
        buildCommon
        ;;
      buildFront:formulaire)
        buildFront:formulaire
        ;;
      buildFront:formulairePublic)
        buildFront:formulairePublic
        ;;
      buildFront)
        install
        ;;
      buildBack:formulaire)
        buildBack:formulaire
        ;;
      buildBack:formulairePublic)
        buildBack:formulairePublic
        ;;
      buildBack)
        install
        ;;
      install:formulaire)
        install:formulaire
        ;;
      install:formulairePublic)
        instal:formulairePublic
        ;;
      install)
        install
        ;;
      lint:formulaire)
        lint:formulaire
        ;;
      lint:formulairePublic)
        lint:formulairePublic
        ;;
      lint)
        lint
        ;;
      testFront)
        testFront
        ;;
      testBack)
        testBack
        ;;
      test)
        testFront
        testBack
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