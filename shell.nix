with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "playcast";
  buildInputs = [
    gnumake
    nodejs-12_x
    yarn
  ];
  shellHook = ''
    export NODE_ENV=development
  '';
}
