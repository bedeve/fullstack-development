---
name: monorepo
route: 1.0. Readme
---

# Fullstack development monorepo

## Install
```sh
npm install -g yarn
git clone https://github.com/bedeve/fullstack-development.git
# or git@github.com:bedeve/fullstack-development.git if you 
# are team member 
cd fullstack-development
yarn 
```

## Run docs
```sh
yarn docz:dev
```

Each folder in `./packages/` is a chapter

At the top of each `.md` or `.mdx` file you can set the name
and the route that will be used.


Contributions to this repository is done by branching and
merging with master.
