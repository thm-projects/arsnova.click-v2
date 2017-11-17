#### Global Dependency Requirements

- NodeJS (Version 7)
- NPM (Version 4)
- @angular/core (Version 5)

---
#### Installation

###### Global
Install NodeJS and NPM and add the binaries to the path variable.
To install the angular core globally, enter `npm install -g @angular/core`. Test with `ng -v` in the terminal.

Clone the project via `git clone --recursive git@git.thm.de:arsnova/arsnova.click-v2.git`
Switch into the project directory and enter `npm i`.

Considering the IntelliJ IDEA IDE it is advised to create a `File => New => Project from existing sources` for the arsnova-click-v2 repo. Then include the other modules of arsnova-click-v2 as `File => New => Module from existing sources`. Use as location the corresponding cloned git submodule. Repeat the step for all required modules.


#### Contribution

###### Contributing to a submodule
If the project is checked out as is any commits to the updated submodules will not be reflected to the parent project. To achieve this the command `git submodule update --remote --recursive` or `npm run update` in the root project folder is required. After that the new commits of the submodules need to be committed to the parent project.