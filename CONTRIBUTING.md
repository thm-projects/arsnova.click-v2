#### Contribution

There are currently the following modules of arsnova.click

- WebApp (Angular): https://git.thm.de/arsnova/arsnova-click-v2-frontend
- API Gateway (NodeJS): https://git.thm.de/arsnova/arsnova-click-v2-backend

To contribute make sure to clone the repo to your local device and make a
feature branch. If you do not have the sufficient rights to create a feature branch
in our repo you'll need to fork it and continue there with your feature branch.

Your branch should either be prefixed with "feature/<ticket-name>" or "bug/<ticket-name>"
to make the purpose of your branch clear.

Add the changes to your branch and make sure the following quality criterias
are met:

- No tslint errors are reported (use the tslint files in the modules)
- The code style standards are followed (see arsnova-click.xml for IntelliJ configuration)
- The code coverage in all modules is at least 60% (for statements)
- All unit tests pass

Open a Pull Request to the **staging** branch of the relevant module and resolve all
upcoming discussions.

Prefix your Pull Request with "WIP: <your-branch-name>" until all discussions have been
resolved.
