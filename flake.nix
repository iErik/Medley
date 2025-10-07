{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-darwin";
    pkgs = import nixpkgs { inherit system; };
    githubToken = "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";
  in {
    devShell.${system} = with pkgs; mkShell {
      nativeBuildInputs = [
        pnpm
        nodejs_24
        rpm
        act
      ];

      buildInputs = [];

      GITHUB_TOKEN = githubToken;
      GH_TOKEN = githubToken;
    };
  };
}
