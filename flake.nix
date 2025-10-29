{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: let
    system = "x86_64-darwin";
    forEachSystem = flake-utils.lib.eachDefaultSystem;

    getPkgs = system: import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };
  in forEachSystem (system: let
    pkgs = getPkgs system;
  in {
    devShells.default = with pkgs; mkShell {
      nativeBuildInputs = [
        pnpm
        nodejs_24
        rpm
        act
      ];

      buildInputs = [];
    };
  });
}
