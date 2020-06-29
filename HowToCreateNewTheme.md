## How to create a new Theme 

1. Create a new .scss file in `src/styles/themes`, please use `theme-` as a prefix. Example:  

        `theme-test.scss`
    - - - 

2. Add your styles in your new file
    - Optional: go to theme-Material.scss in the same folder and copy the code into your file, then adjust the colorcodes.
    - All of the variables are selfexplanatory.
    - Adjust the colorcodes of the variables to impact the themes colors.
    - Consider using complementary colors.
    - - - 

3. Add your new theme in the `docker-compose.yml` in the `root` directory in line 13 and 29. Example:  

        \"test\"
    - - - 

4. Add your new theme under the "Westermann" Theme in the `QuizTheme`.ts file in `src/app/lib/enums`. Example:  

        test = 'test'
    - - - 

5. Add your new theme under the "Westermann" Theme in the `theme-hashes.json` file in `src/assets`. Example:  

        {
            "hash": "__CSS_FILE_HASH__",
            "theme": "test"
        }
    - - - 

6. Optional: Add your new theme under the "Westermann" Theme in the `themeData.json` in `src/assets`. Example:  

        "test": {
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

7. Add your new theme under westermann-blue in the `de.json` in `src/assets/i18n`. Example:  

        "test": {
            "name": "test",
            "description": "test"
        }
    - - - 

8. Add your new theme under westermann-blue in the `en.json` in `src/assets/i18n`. Example:   

        "test": {
            "name": "test",
            "description": "test"
        }
    - - - 

9. Add your new theme under the "Westermann" Theme in the `available-themes.ts` in `src/app/lib`. Example:  

        {
            name: 'component.theme_switcher.themes.test.name',
            preview: 'component.theme_switcher.themes.test.preview',
            description: 'component.theme_switcher.themes.test.description',
            id: QuizTheme.test,
        }
    - - - 

10. Add your new theme in the `angular.json` in the `root` directory under every `styles:` tag. Like so:  

        {
            "inject": false,
            "input": "src/styles/themes/theme-test.scss",
            "bundleName": "theme-test-__CSS_FILE_HASH__"
        },
    - - - 

11. Add your new theme under westermann-blue in the `environment.ts` in  `src/environments`. Example:  

        QuizTheme.test  

<br>

- - - 
    
<br>

    Disclaimer:  
    The preview in the styles tab on localhost:4200 only works after deploying to the staging server.
 