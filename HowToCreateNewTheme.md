## How to create a new Theme 

1. Create a new .scss file in `src/styles/themes`, please use `theme-` as a prefix. Example:  

        theme-<your-theme-name>.scss
    - - - 

2. Add your styles in `theme-<your-theme-name>.scss`
    - Optional: go to theme-Material.scss in the same folder and copy the code into your file, then adjust the colorcodes.
    - All of the variables are selfexplanatory.
    - Adjust the colorcodes of the variables to impact the themes colors.
    - Consider using complementary colors.
    - - - 

3. Add your new theme in the `docker-compose.yml` in the `root` directory. Example (line 13 & line 29):  

        \"<your-theme-name>\"
    - - - 

4. Add your new theme in the `QuizTheme.ts` file in `src/app/lib/enums`. Example (line 12):  

        <your-theme-name> = '<your-theme-name>'
    - - - 

5. Add your new theme in the `theme-hashes.json` file in `src/assets`. Example (line 21):  

        {
            "hash": "__CSS_FILE_HASH__",
            "theme": "<your-theme-name>"
        }
    - - - 

6. Add your new theme in the `themeData.json` in `src/assets`. Example (line 261):  

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

7. Add your new theme in the "theme-switcher.themes" tag in the `de.json` in `src/assets/i18n`. Example (line 612):  

        "<your-theme-name>": {
            "name": "<your-theme-name>",
            "description": "<your-theme-name>"
        }
    - - - 

8. Add your new theme in the "theme-switcher.themes" tag in the `en.json` in `src/assets/i18n`. Example (line 612):   

        "<your-theme-name>": {
            "name": "<your-theme-name>",
            "description": "<your-theme-name>"
        }
    - - - 

9. Add your new theme in the `available-themes.ts` in `src/app/lib`. Example (line 21):  

        {
            name: 'component.theme_switcher.themes.<your-theme-name>.name',
            preview: 'component.theme_switcher.themes.<your-theme-name>.preview',
            description: 'component.theme_switcher.themes.<your-theme-name>.description',
            id: QuizTheme.<your-theme-name>,
        }
    - - - 

10. Add your new theme in the `angular.json` in the `root` directory under the following tags: `options > ... > styles, configurations > ... > styles, thmStaging > ... > styles, thmBeta > ... > styles`. Example (line 76, line 135, line 188 & line 241):  

        {
            "inject": false,
            "input": "src/styles/themes/theme-<your-theme-name>.scss",
            "bundleName": "theme-<your-theme-name>-__CSS_FILE_HASH__"
        },
    - - - 

11. Add your new theme in the `availableQuizThemes` tag in the `environment.ts` in  `src/environments`. Example (line 37):  

        QuizTheme.<your-theme-name>  

<br>

- - - 
    
<br>

    Disclaimer:  
    You need not worry, the preview in the styles tab on localhost:4200 will work after deploying to the staging server.
 