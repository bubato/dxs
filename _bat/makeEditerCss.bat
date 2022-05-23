cd ../

move /y assets\styles\scss\index.css static\assets\cmsEditor\css\index.css
move /y assets\styles\scss\template\friendlyTemplate.css static\assets\cmsEditor\css\friendlyTemplate.css
move /y assets\styles\scss\template\richTemplate.css static\assets\cmsEditor\css\richTemplate.css
move /y assets\styles\scss\template\simpleTemplate.css static\assets\cmsEditor\css\simpleTemplate.css
move /y assets\styles\scss\template\stylishTemplate.css static\assets\cmsEditor\css\stylishTemplate.css

del assets\styles\scss\index.css.map
del assets\styles\scss\editor\editor.css
del assets\styles\scss\editor\editor.css.map

del assets\styles\scss\form\edit\*.css
del assets\styles\scss\form\edit\*.css.map

del assets\styles\scss\sp\*.css
del assets\styles\scss\sp\*.css.map

del assets\styles\scss\template\*.css
del assets\styles\scss\template\*.css.map

