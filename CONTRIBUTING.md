#### Contribution

###### Contributing to a submodule
If the project is checked out as is any commits to the updated submodules will not be reflected to the parent project. To achieve this the command `git submodule update --remote --recursive` or `npm run update` in the root project folder is required. After that the new commits of the submodules need to be committed to the parent project.