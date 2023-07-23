{ pkgs ? import <nixpkgs> { } }:
let
  node = pkgs.nodejs-slim-19_x;
  yarn = pkgs.nodePackages.yarn;
  electron = pkgs.electron_22;
in
pkgs.mkShell {
  nativeBuildInputs = [
    node
    yarn
    electron
  ];

  ELECTRON_OVERRIDE_DIST_PATH = "./node_modules/.bin/electron";
  ELECTRON_ENABLE_LOGGING = "true";
  ELECTRON_RUN_AS_NODE = "true";
}
