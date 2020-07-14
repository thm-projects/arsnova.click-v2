## How to create a new Theme 


1. Navigate to the folder you installed the [frontend](https://git.thm.de/arsnova/arsnova-click-v2-frontend)   
    - - - 

2. Create a new .scss file in `src/styles/themes`, please use `theme-` as a prefix. Example:  

        theme-<your-theme-name>.scss  
    - - - 

3. Add your styles to your newly created `theme-<your-theme-name>.scss` file
    - Optional: go to theme-Material.scss in the same folder and copy the code into your file, then adjust the colorcodes.
    - All of the variables are selfexplanatory.
    - Adjust the colorcodes of the variables to impact the themes colors.
    - Consider using complementary colors.  
    <br>

    - - - 

4. Add the code below to the following tags: `services.master.build.args.themes, services.staging.build.args.themes` in the `docker-compose.yml` file in the `root` directory. Example: 

        \"<your-theme-name>\"
    - - - 

5. Add the code below to the enum in the `QuizTheme.ts` file in `src/app/lib/enums`. Example:

        <your-theme-name> = '<your-theme-name>'
    - - - 

6. Add the code below to the array in the `theme-hashes.json` file in `src/assets`. Example: 

        {
            "hash": "__CSS_FILE_HASH__",
            "theme": "<your-theme-name>"
        }
    - - - 

7. Add the code below to the root of the json object in the `themeData.json` file in `src/assets`. Example:  

        "<your-theme-name>": {
            "quizNameRowStyle": {
            "fg": "#FFFFFF",
            "bg": "#408743"
            },
            "exportedAtRowStyle": {
            "fg": "#FFFFFF",
            "bg": "#EFF4FA"
            },
            "statisticsRowStyle": {
            "fg": "#000000",
            "bg": "#B2DFDB"
            },
            "attendeeHeaderGroupRowStyle": {
            "fg": "#FFFFFF",
            "bg": "#009688"
            },
            "attendeeHeaderRowStyle": {
            "fg": "#000000",
            "bg": "#FF9800"
            },
            "attendeeEntryRowStyle": {
            "fg": "#000000",
            "bg": "#B2DFDB"
            }
        }
    - - - 

8. Add the code below to the `theme-switcher.themes` tag in the `de.json` in `src/assets/i18n`. Example:  

        "<your-theme-name>": {
            "name": "<your-theme-name>",
            "description": "<your-theme-name>"
        }
    - - - 

9. Add the code below to the `theme-switcher.themes` tag in the `en.json` in `src/assets/i18n`. Example:   

        "<your-theme-name>": {
            "name": "<your-theme-name>",
            "description": "<your-theme-name>"
        }
    - - - 

10. Add the code below to the Array in the `available-themes.ts` in `src/app/lib`. Example:  

        {
            name: 'component.theme_switcher.themes.<your-theme-name>.name',
            preview: 'component.theme_switcher.themes.<your-theme-name>.preview',
            description: 'component.theme_switcher.themes.<your-theme-name>.description',
            id: QuizTheme.<your-theme-name>,
        }
    - - - 

11. Add the code below to the following tags: `projects.frontend.architect.build.options.styles, projects.frontend.architect.build.configurations.production.styles, projects.frontend.architect.build.configurations.thmStaging.styles` in the `angular.json` in the `root` directory. Example:  

        {
            "inject": false,
            "input": "src/styles/themes/theme-<your-theme-name>.scss",
            "bundleName": "theme-<your-theme-name>-__CSS_FILE_HASH__"
        },
    - - - 

12. Add the code below to the `availableQuizThemes` tag in the `environment.ts` file in  `src/environments`. Example:  

        QuizTheme.<your-theme-name>  

    <br>

    - - - 

13. To generate a preview image [run the frontend](https://github.com/thm-projects/arsnova.click-v2/blob/master/documentation/Frontend-Installationguide.md) and navigate to `src/assets/jobs` with your terminal and paste `node --experimental-modules --experimental-json-modules GenerateImages.mjs --command=all --host=http://localhost:4200 --root=true` into it. This might take a while.
