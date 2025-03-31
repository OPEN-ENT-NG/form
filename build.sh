#!/bin/bash

# Configuration des variables d'environnement
set -e # Arrête le script si une commande échoue

# Params (option pour fonctionner sans docker)
NO_DOCKER=""
for i in "$@"; do
  case $i in
  --no-docker*)
    NO_DOCKER="true"
    shift
    ;;
  *) ;;
  esac
done

# Détection de l'utilisateur/groupe pour Docker
case $(uname -s) in
MINGW* | Darwin*)
  export USER_UID=1000
  export GROUP_GID=1000
  ;;
*)
  if [ -z ${USER_UID:+x} ]; then
    export USER_UID=$(id -u)
    export GROUP_GID=$(id -g)
  fi
  ;;
esac

# Définir DEFAULT_DOCKER_USER pour la compatibilité avec l'ancien système
export DEFAULT_DOCKER_USER="$USER_UID:$GROUP_GID"

# Initialiser le fichier .env utilisé par docker-compose
echo "DEFAULT_DOCKER_USER=$DEFAULT_DOCKER_USER" >.env

# Fonctions de nettoyage
clean_common() {
  echo -e "\n------------------"
  echo "Cleaning common"
  echo "------------------"
  if [ "$NO_DOCKER" = "true" ]; then
    cd common && mvn clean
    cd .. || exit 1
  else
    docker compose run --rm maven bash -c "cd common && mvn -Duser.home=/var/maven clean"
  fi
}

clean_formulaire() {
  echo -e "\n------------------"
  echo "Cleaning formulaire"
  echo "------------------"

  # Clean Angular
  rm -rf formulaire/angular/node_modules
  rm -rf formulaire/angular/*.lock

  # Clean Frontend
  rm -rf formulaire/frontend/.nx
  rm -rf formulaire/frontend/.pnpm-store
  rm -rf formulaire/frontend/node_modules
  rm -rf formulaire/frontend/dist
  rm -rf formulaire/frontend/build
  rm -f formulaire/frontend/pnpm-lock.yaml

  # Clean Backend
  if [ "$NO_DOCKER" = "true" ]; then
    cd formulaire/backend && mvn clean
    cd ../.. || exit 1
  else
    docker compose run --rm maven bash -c "cd formulaire/backend && mvn -Duser.home=/var/maven clean"
  fi
  rm -rf formulaire/backend/.flattened-pom.xml
  rm -rf formulaire/backend/src/main/resources/img
  rm -rf formulaire/backend/src/main/resources/public
  rm -rf formulaire/backend/src/main/resources/view
}

clean_formulaire_public() {
  echo -e "\n------------------"
  echo "Cleaning formulaire-public"
  echo "------------------"

  # Clean Angular
  rm -rf formulaire-public/angular/node_modules
  rm -rf formulaire-public/angular/*.lock

  # Clean Frontend
  rm -rf formulaire-public/frontend/.nx
  rm -rf formulaire-public/frontend/.pnpm-store
  rm -rf formulaire-public/frontend/node_modules
  rm -rf formulaire-public/frontend/dist
  rm -rf formulaire-public/frontend/build
  rm -f formulaire-public/frontend/pnpm-lock.yaml

  # Clean Backend
  if [ "$NO_DOCKER" = "true" ]; then
    cd formulaire-public/backend && mvn clean
    cd ../.. || exit 1
  else
    docker compose run --rm maven bash -c "cd formulaire-public/backend && mvn -Duser.home=/var/maven clean"
  fi
  rm -rf formulaire-public/backend/.flattened-pom.xml
  rm -rf formulaire-public/backend/src/main/resources/img
  rm -rf formulaire-public/backend/src/main/resources/public
  rm -rf formulaire-public/backend/src/main/resources/view
}

clean() {
  clean_common
  clean_formulaire
  clean_formulaire_public
}

# Fonctions de build
build_common() {
  echo -e "\n------------------"
  echo "Building common"
  echo "------------------"

  if [ "$NO_DOCKER" = "true" ]; then
    cd common && mvn install -DskipTests
    cd .. || exit 1
  else
    docker compose run --rm maven bash -c "cd common && mvn -Duser.home=/var/maven install -DskipTests"
  fi
}

build_angular() {
  local module=$1
  echo -e "\n------------------"
  echo "Building ${module} Angular"
  echo "------------------"

  # Vérifier si le dossier angular existe
  if [ ! -d "${module}/angular" ]; then
    echo "Warning: ${module}/angular directory not found, skipping Angular build"
    return
  fi

  if [ "$NO_DOCKER" = "true" ]; then
    cd ${module}/angular && yarn install --production=false && node_modules/gulp/bin/gulp.js build && yarn run build:sass
    cd ../.. || exit 1
  else
    docker compose run --rm node-angular sh -c "cd ${module}/angular && yarn install --production=false && node_modules/gulp/bin/gulp.js build && yarn run build:sass"
  fi
}

build_frontend() {
  local module=$1
  echo -e "\n------------------"
  echo "Building ${module} Frontend"
  echo "------------------"

  # Vérifier si le dossier frontend existe
  if [ ! -d "${module}/frontend" ]; then
    echo "Warning: ${module}/frontend directory not found, skipping Frontend build"
    return
  fi

  if [ "$NO_DOCKER" = "true" ]; then
    cd ${module}/frontend && pnpm install && pnpm build
    cd ../.. || exit 1
  else
    docker compose run --rm node-frontend sh -c "cd ${module}/frontend && pnpm install --ignore-scripts && pnpm build"
  fi
}

prepare_backend_dirs() {
  local module=$1
  echo -e "\n------------------"
  echo "Preparing ${module} backend directories"
  echo "------------------"

  # Vérifier si le dossier backend existe
  if [ ! -d "${module}/backend" ]; then
    echo "Error: ${module}/backend directory not found"
    exit 1
  fi

  mkdir -p ${module}/backend/src/main/resources/public/css
  mkdir -p ${module}/backend/src/main/resources/public/img
  mkdir -p ${module}/backend/src/main/resources/public/js
  mkdir -p ${module}/backend/src/main/resources/public/mdi
  mkdir -p ${module}/backend/src/main/resources/public/template
  mkdir -p ${module}/backend/src/main/resources/public/ts
  mkdir -p ${module}/backend/src/main/resources/view
}

copy_frontend_files() {
  local module=$1
  echo -e "\n------------------"
  echo "Copying ${module} frontend files"
  echo "------------------"

  # Vérifier si les dossiers existent avant de copier
  if [ -d "${module}/frontend/public" ]; then
    cp -R ${module}/frontend/public/* ${module}/backend/src/main/resources/public 2>/dev/null || :
  fi

  if [ -d "${module}/frontend/dist" ]; then
    cp -R ${module}/frontend/dist/* ${module}/backend/src/main/resources 2>/dev/null || :
  fi

  # Move HTML files to view directory
  find ${module}/backend/src/main/resources -maxdepth 1 -name "*.html" -exec mv {} ${module}/backend/src/main/resources/view/ \; 2>/dev/null || :

  # Vérifier les dossiers Angular
  if [ -d "${module}/angular/src/css" ]; then
    cp -R ${module}/angular/src/css/* ${module}/backend/src/main/resources/public/css 2>/dev/null || :
  fi

  if [ -d "${module}/angular/src/img" ]; then
    cp -R ${module}/angular/src/img/* ${module}/backend/src/main/resources/public/img 2>/dev/null || :
  fi

  if [ -d "${module}/angular/src/dist" ]; then
    cp -R ${module}/angular/src/dist/* ${module}/backend/src/main/resources/public/js 2>/dev/null || :
  fi

  if [ -d "${module}/angular/src/mdi" ]; then
    cp -R ${module}/angular/src/mdi/* ${module}/backend/src/main/resources/public/mdi 2>/dev/null || :
  fi

  if [ -d "${module}/angular/src/template" ]; then
    cp -R ${module}/angular/src/template/* ${module}/backend/src/main/resources/public/template 2>/dev/null || :
  fi

  if [ -d "${module}/angular/src/view" ]; then
    cp -R ${module}/angular/src/view/* ${module}/backend/src/main/resources/view 2>/dev/null || :
  fi

  # Copy '.html' files in 'ts' folder
  if [ -d "${module}/angular/src/ts" ]; then
    cd ${module}/angular/src/ts || exit 1
    shopt -s globstar
    rsync -R **/*.html ../../../backend/src/main/resources/public/ts --relative --no-implied-dirs 2>/dev/null || :
    cd ../../../../ || exit 1
  fi
}

build_backend() {
  local module=$1
  echo -e "\n------------------"
  echo "Building ${module} backend"
  echo "------------------"

  # Vérifier si le dossier backend existe
  if [ ! -d "${module}/backend" ]; then
    echo "Error: ${module}/backend directory not found"
    exit 1
  fi

  if [ "$NO_DOCKER" = "true" ]; then
    cd ${module}/backend && mvn install -DskipTests
    cd ../.. || exit 1
  else
    docker compose run --rm maven bash -c "cd ${module}/backend && mvn -Duser.home=/var/maven install -DskipTests"
  fi
}

publish_module() {
  local module="${1:-}"
  local custom_repo="${2:-}"
  local path="${module:+$module/backend}"

  # Si module est vide ou "common", utiliser le chemin approprié
  if [ -z "$module" ] || [ "$module" = "common" ]; then
    path="common"
  fi

  # Vérifier si le dossier existe
  if [ ! -d "$path" ]; then
    echo "Error: $path directory not found"
    exit 1
  fi

  # Déterminer le dépôt Nexus
  local nexus_repo
  local maven_cmd_extra=""
  if [ -z "$custom_repo" ]; then
    nexus_repo=$(detect_nexus_repository "$module")
  else
    nexus_repo="$custom_repo"
    maven_cmd_extra="-Durl=$custom_repo"
  fi

  echo -e "\n------------------"
  echo "Publishing $path to $nexus_repo repository"
  echo "------------------"

  # Commande Maven de déploiement
  local maven_deploy_cmd="clean deploy -DrepositoryId=ode-$nexus_repo -DskipTests -Dmaven.test.skip=true --settings /var/maven/.m2/settings.xml $maven_cmd_extra"

  # Exécuter la commande de déploiement Maven
  if [ "$NO_DOCKER" = "true" ]; then
    cd $path && mvn $maven_deploy_cmd
    cd - >/dev/null || exit 1
  else
    docker compose run --rm maven bash -c "cd $path && mvn -Duser.home=/var/maven $maven_deploy_cmd"
  fi
}

# Fonction pour installer le POM parent
install_parent_pom() {
  echo -e "\n------------------"
  echo "Installing parent POM"
  echo "------------------"

  if [ "$NO_DOCKER" = "true" ]; then
    mvn clean install -N -U -f pom.xml
  else
    docker compose run --rm maven bash -c "cd /usr/src/maven && mvn clean install -N -U -f pom.xml"
  fi
}

# Fonction principale pour build un module
build_module() {
  local module=$1
  install_parent_pom

  # 2. Build front-end components
  build_angular ${module}
  build_frontend ${module}

  # 3. Prepare backend and copy frontend files
  prepare_backend_dirs ${module}
  copy_frontend_files ${module}

  # 4. Build backend
  build_backend ${module}
}

build_formulaire() {
  build_module "formulaire"
}

build_formulaire_public() {
  build_module "formulaire-public"
}

build_all() {
  build_common
  build_formulaire
  build_formulaire_public
}

# Nouvelles fonctions pour construire uniquement le front (Angular + React) pour chaque module
build_front_formulaire() {
  echo -e "\n------------------"
  echo "Building formulaire frontend only"
  echo "------------------"

  # Construire angular
  build_angular "formulaire"

  # Construire frontend React
  build_frontend "formulaire"

  # Préparer les dossiers backend et copier les fichiers
  prepare_backend_dirs "formulaire"
  copy_frontend_files "formulaire"
}

build_front_formulaire_public() {
  echo -e "\n------------------"
  echo "Building formulaire-public frontend only"
  echo "------------------"

  # Construire angular
  build_angular "formulaire-public"

  # Construire frontend React
  build_frontend "formulaire-public"

  # Préparer les dossiers backend et copier les fichiers
  prepare_backend_dirs "formulaire-public"
  copy_frontend_files "formulaire-public"
}

# Fonctions pour construire uniquement le backend
build_backend_formulaire() {
  echo -e "\n------------------"
  echo "Building formulaire backend only"
  echo "------------------"

  # Construire le backend
  build_backend "formulaire"
}

build_backend_formulaire_public() {
  echo -e "\n------------------"
  echo "Building formulaire-public backend only"
  echo "------------------"

  # Construire le backend
  build_backend "formulaire-public"
}

# Fonctions pour exécuter les modes dev des fronts React
dev_frontend() {
  local module=$1
  echo -e "\n------------------"
  echo "Starting ${module} frontend in dev mode"
  echo "------------------"

  # Vérifier si le dossier frontend existe
  if [ ! -d "${module}/frontend" ]; then
    echo "Error: ${module}/frontend directory not found"
    exit 1
  fi

  if [ "$NO_DOCKER" = "true" ]; then
    cd ${module}/frontend && pnpm install && pnpm dev
    cd ../.. || exit 1
  else
    docker compose run --rm -p 4200:4200 node-frontend sh -c "cd ${module}/frontend && pnpm install --ignore-scripts && pnpm dev"
  fi
}

dev_frontend_formulaire() {
  dev_frontend "formulaire"
}

dev_frontend_formulaire_public() {
  dev_frontend "formulaire-public"
}

# Fonction améliorée pour vérifier les fichiers copiés
verify_copied_files() {
  local module=$1
  echo -e "\n------------------"
  echo "Verifying copied files for ${module}"
  echo "------------------"

  # Vérifier si les dossiers de destination existent
  if [ ! -d "${module}/backend/src/main/resources/public" ]; then
    echo "Error: ${module}/backend/src/main/resources/public directory not found"
    return 1
  fi

  # Compter le nombre de fichiers copiés
  local css_count=$(find ${module}/backend/src/main/resources/public/css -type f 2>/dev/null | wc -l)
  local js_count=$(find ${module}/backend/src/main/resources/public/js -type f 2>/dev/null | wc -l)
  local img_count=$(find ${module}/backend/src/main/resources/public/img -type f 2>/dev/null | wc -l)
  local view_count=$(find ${module}/backend/src/main/resources/view -type f 2>/dev/null | wc -l)

  echo "Files copied to ${module}/backend/src/main/resources:"
  echo "- CSS files: $css_count"
  echo "- JavaScript files: $js_count"
  echo "- Image files: $img_count"
  echo "- View files: $view_count"

  # Vérifier si des fichiers ont été copiés
  if [ $css_count -eq 0 ] && [ $js_count -eq 0 ] && [ $view_count -eq 0 ]; then
    echo "Warning: No files seem to have been copied. Build might be incomplete."
    return 1
  else
    echo "Files copy verification passed."
    return 0
  fi
}

# Fonctions de publication
detect_nexus_repository() {
  local module=$1
  local path="${module:+$module/backend}"

  # Si module est vide ou "common", utiliser le chemin approprié
  if [ -z "$module" ] || [ "$module" = "common" ]; then
    path="common"
  fi

  # Récupérer la version
  local version
  if [ "$NO_DOCKER" = "true" ]; then
    cd $path
    version=$(mvn help:evaluate -Dexpression=project.version -q -DforceStdout)
    cd - >/dev/null || exit 1
  else
    version=$(docker compose run --rm maven bash -c "cd $path && mvn -Duser.home=/var/maven help:evaluate -Dexpression=project.version -q -DforceStdout")
  fi

  # Déterminer le type de dépôt en fonction de SNAPSHOT
  if [[ $version == *SNAPSHOT ]]; then
    echo "snapshots"
  else
    echo "releases"
  fi
}

# Les fonctions suivantes restent inchangées
publish_common() {
  publish_module "common"
}

publish_formulaire() {
  publish_module "formulaire"
}

publish_formulaire_public() {
  publish_module "formulaire-public"
}

publish_all() {
  publish_common
  publish_formulaire
  publish_formulaire_public
}

publish_nexus_common() {
  publish_module "common" "$1"
}

publish_nexus_formulaire() {
  publish_module "formulaire" "$1"
}

publish_nexus_formulaire_public() {
  publish_module "formulaire-public" "$1"
}

publish_nexus_all() {
  local repo=$1
  publish_module "common" "$repo"
  publish_module "formulaire" "$repo"
  publish_module "formulaire-public" "$repo"
}

# Fonctions de test
test_module() {
  local module=$1

  # Vérifier si les dossiers existent
  if [ ! -d "${module}/frontend" ] && [ ! -d "${module}/backend" ]; then
    echo "Error: ${module} directories not found"
    exit 1
  fi

  if [ -d "${module}/frontend" ]; then
    echo -e "\n------------------"
    echo "Testing ${module} frontend"
    echo "------------------"
    if [ "$NO_DOCKER" = "true" ]; then
      cd ${module}/frontend && pnpm test
      cd ../.. || exit 1
    else
      docker compose run --rm node-frontend sh -c "cd ${module}/frontend && pnpm test"
    fi
  fi

  if [ -d "${module}/backend" ]; then
    echo -e "\n------------------"
    echo "Testing ${module} backend"
    echo "------------------"
    if [ "$NO_DOCKER" = "true" ]; then
      cd ${module}/backend && mvn test
      cd ../.. || exit 1
    else
      docker compose run --rm maven bash -c "cd ${module}/backend && mvn -Duser.home=/var/maven test"
    fi
  fi
}

test_formulaire() {
  test_module "formulaire"
}

test_formulaire_public() {
  test_module "formulaire-public"
}

test_all() {
  test_formulaire
  test_formulaire_public
}

# Fonctions pour le linting
lint_module() {
  local module=$1

  # Vérifier si le dossier frontend existe
  if [ ! -d "${module}/frontend" ]; then
    echo "Error: ${module}/frontend directory not found"
    exit 1
  fi

  echo -e "\n------------------"
  echo "Linting ${module} frontend"
  echo "------------------"
  if [ "$NO_DOCKER" = "true" ]; then
    cd ${module}/frontend && pnpm run fix && pnpm run check-types && pnpm run format:write
    cd ../.. || exit 1
  else
    docker compose run --rm node-frontend sh -c "cd ${module}/frontend && pnpm run fix && pnpm run check-types && pnpm run format:write"
  fi
}

lint_formulaire() {
  lint_module "formulaire"
}

lint_formulaire_public() {
  lint_module "formulaire-public"
}

lint_all() {
  lint_formulaire
  lint_formulaire_public
}

# Fonction principale pour traiter les arguments
main() {
  if [ $# -eq 0 ]; then
    echo "Usage: ./build.sh [--no-docker] [command] [module] [options]"
    echo "Commands:"
    echo "  clean            - Clean all modules or a specific module"
    echo "  build            - Build all modules or a specific module"
    echo "  buildFront       - Build only the frontend part of a module"
    echo "  buildBack        - Build only the backend part of a module"
    echo "  dev              - Run development mode for a module's frontend"
    echo "  test             - Run tests for all modules or a specific module"
    echo "  lint             - Run linting for all modules or a specific module"
    echo "  publish          - Publish all modules or a specific module to default Nexus repository"
    echo "  publishNexus     - Publish all modules or a specific module to a specific Nexus repository URL"
    echo "  verify           - Verify that frontend files are correctly copied to backend"
    echo "Modules:"
    echo "  common           - Common module"
    echo "  formulaire       - Formulaire module"
    echo "  formulaire-public - Formulaire Public module"
    echo "Options:"
    echo "  --no-docker      - Run commands locally without Docker"
    echo "  For publishNexus: repository URL as third argument"
    echo "Examples:"
    echo "  ./build.sh clean                - Clean all modules"
    echo "  ./build.sh clean formulaire     - Clean formulaire module"
    echo "  ./build.sh build                - Build all modules"
    echo "  ./build.sh build common         - Build only common module"
    echo "  ./build.sh buildFront formulaire - Build only the frontend of formulaire"
    echo "  ./build.sh buildBack formulaire  - Build only the backend of formulaire"
    echo "  ./build.sh dev formulaire       - Run formulaire frontend in dev mode"
    echo "  ./build.sh test formulaire      - Test formulaire module"
    echo "  ./build.sh verify formulaire    - Verify files copied for formulaire"
    echo "  ./build.sh publish              - Publish all modules to default Nexus"
    echo "  ./build.sh publish common       - Publish only common module to default Nexus"
    echo "  ./build.sh publishNexus common https://my-nexus/repo - Publish common to specific Nexus"
    echo "  ./build.sh --no-docker build    - Build without using Docker"
    exit 1
  fi

  # Filtrer les arguments de commande
  local args=()
  for arg in "$@"; do
    if [[ "$arg" != --no-docker* ]]; then
      args+=("$arg")
    fi
  done

  command=${args[0]}
  module=${args[1]}
  repo=${args[2]}

  case $command in
  clean)
    if [ -z "$module" ]; then
      clean
    else
      case $module in
      common)
        clean_common
        ;;
      formulaire)
        clean_formulaire
        ;;
      formulaire-public)
        clean_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  build)
    if [ -z "$module" ]; then
      build_all
    else
      case $module in
      common)
        build_common
        ;;
      formulaire)
        build_formulaire
        ;;
      formulaire-public)
        build_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  buildFront)
    if [ -z "$module" ]; then
      echo "Error: Module is required for buildFront command"
      exit 1
    else
      case $module in
      formulaire)
        build_front_formulaire
        ;;
      formulaire-public)
        build_front_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  buildBack)
    if [ -z "$module" ]; then
      echo "Error: Module is required for buildBack command"
      exit 1
    else
      case $module in
      formulaire)
        build_backend_formulaire
        ;;
      formulaire-public)
        build_backend_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  dev)
    if [ -z "$module" ]; then
      echo "Error: Module is required for dev command"
      exit 1
    else
      case $module in
      formulaire)
        dev_frontend_formulaire
        ;;
      formulaire-public)
        dev_frontend_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  verify)
    if [ -z "$module" ]; then
      echo "Error: Module is required for verify command"
      exit 1
    else
      case $module in
      formulaire)
        verify_copied_files "formulaire"
        ;;
      formulaire-public)
        verify_copied_files "formulaire-public"
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  test)
    if [ -z "$module" ]; then
      test_all
    else
      case $module in
      formulaire)
        test_formulaire
        ;;
      formulaire-public)
        test_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  lint)
    if [ -z "$module" ]; then
      lint_all
    else
      case $module in
      formulaire)
        lint_formulaire
        ;;
      formulaire-public)
        lint_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  publish)
    if [ -z "$module" ]; then
      publish_all
    else
      case $module in
      common)
        publish_common
        ;;
      formulaire)
        publish_formulaire
        ;;
      formulaire-public)
        publish_formulaire_public
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  publishNexus)
    if [ -z "$repo" ]; then
      echo "Error: Repository URL is required for publishNexus command"
      exit 1
    fi

    if [ -z "$module" ]; then
      publish_nexus_all "$repo"
    else
      case $module in
      common)
        publish_nexus_common "$repo"
        ;;
      formulaire)
        publish_nexus_formulaire "$repo"
        ;;
      formulaire-public)
        publish_nexus_formulaire_public "$repo"
        ;;
      *)
        echo "Unknown module: $module"
        exit 1
        ;;
      esac
    fi
    ;;
  *)
    echo "Unknown command: $command"
    exit 1
    ;;
  esac
}

# Exécution de la fonction principale avec tous les arguments
main "$@"
