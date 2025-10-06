{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-darwin";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShell.${system} = with pkgs; mkShell {
      nativeBuildInputs = [
        pnpm
        nodejs-slim_24
      ];

      buildInputs = [];
    };
  };
}
