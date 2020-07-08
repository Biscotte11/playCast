with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "playcast";
  buildInputs = [
    parallel
    gnumake
    nodejs-12_x
    yarn
  ];
  shellHook = ''
    export NODE_ENV=development

    export STACK_API_ENDPOINT=http://e.localhost:7772
    export STACK_PLAYER_ENDPOINT=http://e.localhost:7771
  '';
}
